import { CantoMainnet, PrimaryButton, Text } from "cantoui";
import TransferBox from "components/TransferBox";
import { GTokens } from "hooks/useGravityTokens";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { selectedEmptyToken, useTokenStore } from "stores/tokens";
import styled from "styled-components";
import { TokenWallet } from "./TokenSelect";
import {
  getCantoBalance,
  NativeGTokens,
  useCosmosTokens,
} from "hooks/useCosmosTokens";
import { useEthers } from "@usedapp/core";
import { addNetwork } from "utils/addCantoToWallet";
import { ethers } from "ethers";
import { txConvertERC20 } from "utils/cantoTransactions/convertCoin/convertTransactions";
import { chain, fee, memo } from "config/networks";
import TransferOutBox from "components/TransferOutBox";
import { txIBCTransfer } from "utils/IBC/IBCTransfer";
import {
  checkBridgeAmountConfirmation,
  checkGravityAddress,
} from "utils/bridgeConfirmations";

const BridgeOut = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const { activateBrowserWallet } = useEthers();

  //CONVERT STATES
  const [convertAmount, setConvertAmount] = useState("0");
  //convert states to update the user
  const [convertConfirmation, setConvertConfirmation] =
    useState("select a token");
  const [inConvertTransaction, setInConvertTransaction] =
    useState<boolean>(false);
  //used to check if convert coin ws successful
  const [prevConvertBalance, setPrevConvertBalance] = useState(0);

  //BRIDGE OUT STATES
  const [userGravityAddress, setUserGravityAddress] = useState("");
  const [bridgeAmount, setBridgeAmount] = useState("0");
  //bridging to gravity bridge status
  const [bridgeConfirmation, setBridgeConfirmation] =
    useState("select a token");
  const [inBridgeTransaction, setInBridgeTransaction] =
    useState<boolean>(false);
  const [prevBridgeBalance, setPrevBridgeBalance] = useState(0);

  //set the gravity token info from canto mainnet
  const { gravityTokens } = useCosmosTokens(networkInfo.account);
  //will contain the eth gravity tokens with the native canto balances
  const [cantoGravityTokens, setCantoGravityTokens] = useState<
    NativeGTokens[] | undefined
  >([]);

  async function getBalances(gravityTokens: GTokens[]) {
    const tokensWithBalances: NativeGTokens[] = await getCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      gravityTokens
    );
    setCantoGravityTokens(tokensWithBalances);
  }

  //Useffect for calling data per block
  useEffect(() => {
    const interval = setInterval(async () => {
      if (gravityTokens) {
        await getBalances(gravityTokens);
        tokenStore.setSelectedToken(
          cantoGravityTokens?.find(
            (token) =>
              token.data.address == tokenStore.selectedToken.data.address
          ) ?? tokenStore.selectedToken
        );
      }
      //check if convertCoin has been called
      if (inConvertTransaction) {
        if (Number(tokenStore.selectedToken.balanceOf) != prevConvertBalance) {
          setConvertConfirmation(
            "you have successfully bridged " +
              tokenStore.selectedToken.data.symbol +
              " from evm to canto"
          );
          setInConvertTransaction(false);
        }
      }
      if (inBridgeTransaction) {
        if (
          Number(tokenStore.selectedToken.nativeBalanceOf) != prevBridgeBalance
        ) {
          setBridgeConfirmation(
            "you have successfully bridged " +
              tokenStore.selectedToken.data.symbol +
              " from canto to gravity bridge"
          );
          setInBridgeTransaction(false);
        }
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [gravityTokens]);

  //setting native canto balances whenever eth gravity tokens change
  useEffect(() => {
    if (gravityTokens) {
      getBalances(gravityTokens);
    }
  }, [gravityTokens?.length]);

  return (
    <Container>
      <Text type="title" color="white">
        send funds from canto
      </Text>
      <TokenWallet
        tokens={cantoGravityTokens}
        activeToken={tokenStore.selectedToken}
        onSelect={(value) => {
          tokenStore.setSelectedToken(value);
          setConvertConfirmation(
            checkBridgeAmountConfirmation(
              Number(convertAmount),
              Number(tokenStore.selectedToken.balanceOf)
            )
          );
          setBridgeConfirmation(
            checkBridgeAmountConfirmation(
              Number(bridgeAmount),
              Number(tokenStore.selectedToken.nativeBalanceOf)
            )
          );
          setInConvertTransaction(false);
          setInBridgeTransaction(false);
        }}
      />
      <Text type="text" color="white" style={{ width: "70%" }}>
        you must bridge your assets from the canto EVM to the canto (bridge) to
        bridge out. read more{" "}
        <a
          href="https://docs.canto.io/user-guides/converting-assets"
          style={{
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          here
        </a>
        .
      </Text>
      <TransferBox
        from={{
          address: networkInfo.account,
          name: "canto (EVM)",
        }}
        to={{
          address: networkInfo.cantoAddress,
          name: "canto (bridge)",
        }}
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="canto"
        onSwitch={() => {
          activateBrowserWallet();
          addNetwork();
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
        onChange={(amount: string) => {
          setConvertAmount(amount);
          setConvertConfirmation(
            checkBridgeAmountConfirmation(
              Number(amount),
              Number(tokenStore.selectedToken.balanceOf)
            )
          );
        }}
        max={tokenStore.selectedToken.balanceOf.toString()}
        amount={convertAmount}
        button={
          <PrimaryButton
            disabled={
              tokenStore.selectedToken == selectedEmptyToken ||
              Number(convertAmount) == 0 ||
              Number(convertAmount) >
                Number(tokenStore.selectedToken.balanceOf) ||
              Number(networkInfo.chainId) != CantoMainnet.chainId
            }
            onClick={async () => {
              setConvertConfirmation(
                "waiting for the metamask transaction to be signed..."
              );
              await txConvertERC20(
                tokenStore.selectedToken.data.address,
                ethers.utils
                  .parseUnits(
                    convertAmount,
                    tokenStore.selectedToken.data.decimals
                  )
                  .toString(),
                networkInfo.cantoAddress,
                CantoMainnet.cosmosAPIEndpoint,
                fee,
                chain,
                memo
              );
              setConvertConfirmation(
                "waiting for the transaction to be verified..."
              );
              setInConvertTransaction(true);
              setPrevConvertBalance(tokenStore.selectedToken.balanceOf);
            }}
          >
            {convertConfirmation}
          </PrimaryButton>
        }
      />

      <Text type="text" color="white" style={{ width: "70%" }}>
        it could take several minutes for your bridged assets to arrive on the
        gravity bridge network. for more detail, read{" "}
        <a
          href="https://docs.canto.io/user-guides/bridging-assets"
          style={{
            color: "white",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          here
        </a>
        .
      </Text>
      <TransferOutBox
        onAddressChange={(e) => {
          setUserGravityAddress(e.currentTarget.value);
          if (!checkGravityAddress(e.target.value)) {
            setBridgeConfirmation("enter valid gravity address");
          } else {
            setBridgeConfirmation(
              checkBridgeAmountConfirmation(
                Number(bridgeAmount),
                Number(tokenStore.selectedToken.nativeBalanceOf)
              )
            );
          }
        }}
        from={{
          address: networkInfo.cantoAddress,
          name: "canto (bridge)",
        }}
        to={{
          address: userGravityAddress,
          name: "gravity bridge",
        }}
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="canto"
        onSwitch={() => {
          activateBrowserWallet();
          addNetwork();
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
        onChange={(amount: string) => {
          setBridgeAmount(amount);
          setBridgeConfirmation(
            checkBridgeAmountConfirmation(
              Number(amount),
              Number(tokenStore.selectedToken.nativeBalanceOf)
            )
          );
        }}
        max={tokenStore.selectedToken.nativeBalanceOf}
        amount={bridgeAmount}
        button={
          <PrimaryButton
            disabled={
              !(CantoMainnet.chainId == Number(networkInfo.chainId)) ||
              tokenStore.selectedToken == selectedEmptyToken ||
              Number(bridgeAmount) <= 0 ||
              Number(bridgeAmount) >
                Number(tokenStore.selectedToken.nativeBalanceOf) ||
              !checkGravityAddress(userGravityAddress)
            }
            onClick={async () => {
              setBridgeConfirmation(
                "waiting for the metamask transaction to be signed..."
              );
              const response = await txIBCTransfer(
                userGravityAddress,
                "channel-0",
                ethers.utils
                  .parseUnits(
                    bridgeAmount,
                    tokenStore.selectedToken.data.decimals
                  )
                  .toString(),
                tokenStore.selectedToken.data.nativeName,
                CantoMainnet.cosmosAPIEndpoint,
                "https://gravitychain.io:1317",
                fee,
                chain,
                memo
              );
              setBridgeConfirmation(
                "waiting for the transaction to be verified..."
              );
              // if (response.tx_response?.txhash) {
              //   toast("bridge out successful", {
              //     position: "top-right",
              //     autoClose: 5000,
              //     hideProgressBar: false,
              //     closeOnClick: true,
              //     pauseOnHover: true,
              //     draggable: true,
              //     progressStyle: {
              //       color: "var(--primary-color)",
              //     },
              //     style: {
              //       border: "1px solid var(--primary-color)",
              //       borderRadius: "0px",
              //       paddingBottom: "3px",
              //       background: "black",
              //       color: "var(--primary-color)",
              //       height: "100px",
              //       fontSize: "20px",
              //     },
              //   });
              // }
              setInBridgeTransaction(true);
              setPrevBridgeBalance(
                Number(tokenStore.selectedToken.nativeBalanceOf)
              );
            }}
          >
            {bridgeConfirmation}
          </PrimaryButton>
        }
      />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 560px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;
export default BridgeOut;

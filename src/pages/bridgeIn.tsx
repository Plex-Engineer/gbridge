import { ADDRESSES, CantoMainnet, PrimaryButton, Text } from "cantoui";
import CopyIcon from "assets/copy.svg";
import TransferBox from "components/TransferBox";
import { GTokens, useGravityTokens } from "hooks/useGravityTokens";
import React, { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { selectedEmptyToken, useTokenStore } from "stores/tokens";
import styled from "styled-components";
import { TokenWallet } from "./TokenSelect";
import arrow from "assets/right.svg";
import { getCantoBalance, NativeGTokens } from "hooks/useCosmosTokens";
import { toast } from "react-toastify";
import { useApprove, useCosmos } from "./useTransactions";
import { useEthers } from "@usedapp/core";
import { addNetwork } from "utils/addCantoToWallet";
import { ReactiveButton } from "./ReactiveButton";
import { BigNumber, ethers } from "ethers";
import { txConvertCoin } from "utils/cantoTransactions/convertCoin/convertTransactions";
import { chain, fee, memo } from "config/networks";
const BridgeIn = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const { switchNetwork, activateBrowserWallet } = useEthers();
  const activeToken = useTokenStore().selectedToken;
  const [bridgeAmount, setBridgeAmount] = useState("0");
  const [convertAmount, setConvertAmount] = useState("0");
  const [convertConfirmation, setConvertConfirmation] = useState("Bridge In");

  //set the gravity token info from ethMainnet
  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account
  );

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

  //setting native canto balances whenever eth gravity tokens change
  useEffect(() => {
    if (gravityTokens) {
      getBalances(gravityTokens);
    }
  }, [gravityTokens?.length]);

  //function states for approving/bridging
  const {
    state: stateApprove,
    send: sendApprove,
    resetState: resetApprove,
  } = useApprove(tokenStore.selectedToken.data.address);
  const {
    state: stateCosmos,
    send: sendCosmos,
    resetState: resetCosmos,
  } = useCosmos(gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge);

  //event tracker
  useEffect(() => {
    tokenStore.setApproveStatus(stateApprove.status);
    if (stateApprove.status == "Success") {
      tokenStore.setSelectedToken({
        ...tokenStore.selectedToken,
        allowance: Number.MAX_VALUE,
      });
      setTimeout(() => {
        resetApprove();
      }, 1000);
    }
  }, [stateApprove.status]);

  useEffect(() => {
    tokenStore.setCosmosStatus(stateCosmos.status);
  }, [stateCosmos.status]);

  const send = (amount: string) => {
    //Checking if amount enter is greater than balance available in wallet and token has been approved.
    if (!networkInfo.cantoAddress) return;
    if (
      (Number(amount) >= activeToken.allowance || activeToken.allowance <= 0) &&
      stateApprove.status == "None"
    ) {
      sendApprove(
        gravityAddress,
        BigNumber.from(
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
      );
    } else if (Number(amount) > 0 && stateCosmos.status == "None") {
      sendCosmos(
        activeToken.data.address,
        networkInfo.cantoAddress,
        ethers.utils.parseUnits(amount, activeToken.data.decimals)
      );
    }
  };

  return (
    <Container>
      <Text type="title" color="white">
        Send funds to canto
      </Text>
      <TokenWallet
        tokens={cantoGravityTokens}
        activeToken={tokenStore.selectedToken}
        onSelect={(value) => {
          tokenStore.setSelectedToken(value);
          resetCosmos();
          resetApprove();
          setConvertConfirmation("");
        }}
      />
      {/* <Row>
        <Text type="title" color="white">
          Ethereum
        </Text>
        <Text
          type="text"
          color="white"
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
          onClick={() => copyAddress(networkInfo.account)}
        >
          {networkInfo.account?.slice(0, 6) +
            "..." +
            networkInfo.account?.slice(-6, -1)}

          <img src={CopyIcon} style={{ height: "22px", marginLeft: "5px" }} />
        </Text>
      </Row> */}

      <Text type="text" color="white" style={{ width: "70%" }}>
        it takes several minutes for your bridged assets to arrive on the canto
        network. for more details, read more here.
      </Text>
      <TransferBox
        from={{
          address: networkInfo.account,
          name: "Ethereum",
        }}
        to={{
          address: networkInfo.cantoAddress,
          name: "Canto (Bridge)",
        }}
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="ethereum"
        onSwitch={() => {
          activateBrowserWallet();
          switchNetwork(1);
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={1 == Number(networkInfo.chainId)}
        onChange={(amount: string) => setBridgeAmount(amount)}
        max={tokenStore.selectedToken.balanceOf.toString()}
        amount={bridgeAmount}
        button={
          <ReactiveButton
            destination={networkInfo.cantoAddress}
            amount={bridgeAmount}
            account={networkInfo.account}
            token={tokenStore.selectedToken}
            gravityAddress={gravityAddress}
            hasPubKey={networkInfo.hasPubKey}
            disabled={false}
            onClick={() => send(bridgeAmount)}
          />
        }
      />

      <Text type="text" color="white" style={{ width: "70%" }}>
        you must bridge your assets from canto (bridge) to canto to use them on
        the canto network. read more here
      </Text>
      {/* <img src={arrow} alt="next" /> */}

      {/* <Row>
        <Text type="title" color="white">
          Canto
        </Text>
        <Text
          type="text"
          color="white"
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
          onClick={() => copyAddress(networkInfo.account)}
        >
          {networkInfo.cantoAddress
            ? networkInfo.cantoAddress.slice(0, 10) +
              "..." +
              networkInfo.cantoAddress.slice(-5)
            : "retrieving wallet"}

          <img src={CopyIcon} style={{ height: "22px", marginLeft: "5px" }} />
        </Text>
      </Row> */}

      <TransferBox
        from={{
          address: networkInfo.cantoAddress,
          name: "Canto (Bridge)",
        }}
        to={{
          address: networkInfo.account,
          name: "Canto (EVM)",
        }}
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="canto"
        onSwitch={() => {
          activateBrowserWallet();
          addNetwork();
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
        onChange={(amount: string) => setConvertAmount(amount)}
        max={tokenStore.selectedToken.nativeBalanceOf}
        amount={convertAmount}
        button={
          <PrimaryButton
            disabled={!networkInfo.hasPubKey}
            onClick={async () => {
              const REFRESH_RATE = 11000;
              setConvertConfirmation(
                "waiting for the metamask transaction to be signed..."
              );
              await txConvertCoin(
                networkInfo.cantoAddress,
                tokenStore.selectedToken.data.nativeName,
                ethers.utils
                  .parseUnits(
                    convertAmount,
                    tokenStore.selectedToken.data.decimals
                  )
                  .toString(),
                CantoMainnet.cosmosAPIEndpoint,
                fee,
                chain,
                memo
              );
              setConvertConfirmation(
                "waiting for the transaction to be verified..."
              );
              setTimeout(async () => {
                const currentBalance = tokenStore.selectedToken.nativeBalanceOf;
                const token: NativeGTokens[] = await getCantoBalance(
                  CantoMainnet.cosmosAPIEndpoint,
                  networkInfo.cantoAddress,
                  [tokenStore.selectedToken]
                );
                const success = currentBalance != token[0].nativeBalanceOf;
                console.log(
                  "🚀 ~ file: bridgeIn.tsx ~ line 211 ~ setTimeout ~ cantoGravityTokens",
                  token
                );
                const prefix = success ? "" : "un";
                const message =
                  "you have " +
                  prefix +
                  "successfully converted " +
                  convertAmount +
                  " of canto " +
                  tokenStore.selectedToken.data.symbol +
                  " to evm ";
                setConvertConfirmation(message);
                tokenStore.setSelectedToken(token[0]);
              }, REFRESH_RATE * 2.5);
            }}
          >
            {convertConfirmation}
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
export default BridgeIn;

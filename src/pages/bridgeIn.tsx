import { ADDRESSES, CantoMainnet, FilledButton, PrimaryButton, Text } from "cantoui";
import CopyIcon from "assets/copyIcon.svg";
import TransferBox from "components/TransferBox";
import { GTokens, useGravityTokens } from "hooks/useGravityTokens";
import React, { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { selectedEmptyToken, useTokenStore } from "stores/tokens";
import styled from "styled-components";
import { TokenWallet } from "./TokenSelect";
import arrow from "assets/arrow.svg";
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
  const [convertConfirmation, setConvertConfirmation] = useState("")

  //set the gravity token info from ethMainnet
  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account
  );

  //will contain the eth gravity tokens with the native canto balances
  const [cantoGravityTokens, setCantoGravityTokens] = useState<
    NativeGTokens[] | undefined
  >([]);

  async function getBalances(gravityTokens: GTokens[]) {
    const tokensWithBalances : NativeGTokens[] = await getCantoBalance(
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

  function copyAddress(value: string | undefined) {
    navigator.clipboard.writeText(value ?? "");
    toast("copied address", {
      autoClose: 300,
    });
  }

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

  const send = (amount : string) => {
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
      <Text type="title" color="white">
        Ethereum
        <span
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
        </span>
        <img
          src={CopyIcon}
          style={{ background: "white", height: "15px", marginLeft: "5px" }}
        />
      </Text>
      <TransferBox
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="ethereum"
        onSwitch={() => {
        activateBrowserWallet();
          switchNetwork(1);
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={1 == Number(networkInfo.chainId)}
        onChange={(amount:string) => setBridgeAmount(amount)}
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
      <img src={arrow} alt="next" />

      <Text type="title" color="white">
        Canto
      </Text>

      <TransferBox
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="canto"
        onSwitch={() => {
          activateBrowserWallet();
          addNetwork();
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
        connected={CantoMainnet.chainId == Number(networkInfo.chainId)}
        onChange={(amount:string) => setConvertAmount(amount)}
        max={tokenStore.selectedToken.nativeBalanceOf}
        amount={convertAmount}
        button={
          <PrimaryButton
            disabled={!networkInfo.hasPubKey}
            onClick={async () => {
                const REFRESH_RATE = 11000;
                setConvertConfirmation("waiting for the metamask transaction to be signed...");
                await txConvertCoin(
                    networkInfo.cantoAddress,
                    tokenStore.selectedToken.data.nativeName,
                    ethers.utils.parseUnits(convertAmount, tokenStore.selectedToken.data.decimals).toString(),
                    CantoMainnet.cosmosAPIEndpoint,
                    fee,
                    chain,
                    memo
                );
                setConvertConfirmation("waiting for the transaction to be verified...");
                setTimeout(async () => {
                    const currentBalance = tokenStore.selectedToken.nativeBalanceOf;
                    const token : NativeGTokens[] = await getCantoBalance(
                        CantoMainnet.cosmosAPIEndpoint,
                        networkInfo.cantoAddress,
                        [tokenStore.selectedToken]
                      );
                    const success = currentBalance != token[0].nativeBalanceOf
                    console.log("🚀 ~ file: bridgeIn.tsx ~ line 211 ~ setTimeout ~ cantoGravityTokens", token)
                    const prefix = success ?  "" : "un";
                    const message =
                      "you have " +
                      prefix +
                      "successfully converted " +
                      convertAmount +
                      " of canto " +
                      tokenStore.selectedToken.data.symbol +
                      " to evm "
                    setConvertConfirmation(
                        message 
                    );
                    tokenStore.setSelectedToken(token[0])
                  }, REFRESH_RATE * 2.5);
                  

            }}
          >bridge</PrimaryButton>
        }
      />
      <div>{convertConfirmation}</div>
      <img src={arrow} alt="next" />
      <Text type="title" color="primary">
        Canto (EVM)
      </Text>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
`;
export default BridgeIn;

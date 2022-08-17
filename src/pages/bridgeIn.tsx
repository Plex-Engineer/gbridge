import { ADDRESSES, CantoMainnet, Text } from "cantoui";
import TransferBox from "components/TransferBox";
import { GTokens, useGravityTokens } from "hooks/useGravityTokens";
import React, { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { useTokenStore } from "stores/tokens";
import styled from "styled-components";
import { TokenWallet } from "./TokenSelect";
import arrow from "assets/arrow.svg";
import { getCantoBalance } from "hooks/useCosmosTokens";
import { toast } from "react-toastify";
import { useApprove, useCosmos } from "./useTransactions";
import { useEthers } from "@usedapp/core";
import { addNetwork } from "utils/addCantoToWallet";
const BridgeIn = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const [cantoTokens, setCantoTokens] = useState<GTokens[] | undefined>([]);
  const { switchNetwork } = useEthers();
  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account,
    Number(networkInfo.chainId)
  );

  async function getBalances(gravityTokens: GTokens[]) {
    const tokensWithBalances = await getCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress,
      gravityTokens
    );

    setCantoTokens(tokensWithBalances);
  }

  useEffect(() => {
    if (gravityTokens) {
      getBalances(gravityTokens);
    }
  }, [gravityTokens?.length]);

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
      // tokenStore.setSelectedToken(gravityTokens?.find(item => item.data.address == tokenStore.selectedToken.data.address))
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

  return (
    <Container>
      <Text type="title" color="white">
        Send funds to canto
      </Text>
      <TokenWallet
        tokens={gravityTokens}
        activeToken={tokenStore.selectedToken}
        onSelect={(value) => {
          tokenStore.setSelectedToken(value);
          resetCosmos();
          resetApprove();
        }}
      />
      <Text type="title" color="white">
        Ethereum
        <span
          style={{
            fontSize: "20px",
            marginLeft: "30px",
          }}
        >
          {networkInfo.account?.slice(0, 6) +
            "..." +
            networkInfo.account?.slice(-6, -1)}
        </span>
      </Text>
      <TransferBox
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="Ethereum"
        onBridge={() => {
          console.log("bridedsasdlaksjh");
        }}
        onSwitch={() => {
          switchNetwork(1);
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
      />
      <img src={arrow} alt="next" />

      <Text type="title" color="white">
        Canto
      </Text>

      <TransferBox
        tokenIcon={tokenStore.selectedToken.data.icon}
        networkName="Canto"
        onBridge={() => {}}
        onSwitch={() => {
          console.log(
            "🚀 ~ file: bridgeIn.tsx ~ line 100 ~ onSwitch ~ networkInfo"
          );
          //   addNetwork();
        }}
        tokenSymbol={tokenStore.selectedToken.data.symbol}
      />
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

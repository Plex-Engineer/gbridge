import { Text } from "cantoui";
import TransferBox from "components/TransferBox";
import { useGravityTokens } from "hooks/useGravityTokens";
import React from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { useTokenStore } from "stores/tokens";
import styled from "styled-components";
import { TokenWallet } from "./TokenSelect";
import arrow from "assets/arrow.svg";
const BridgeIn = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();

  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account,
    Number(networkInfo.chainId)
  );

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
          //   resetCosmos();
          //   resetApprove();
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
        onBridge={() => {}}
        onSwitch={() => {}}
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
        onSwitch={() => {}}
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

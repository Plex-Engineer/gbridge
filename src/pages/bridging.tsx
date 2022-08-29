import styled from "@emotion/styled";
import { CantoMainnet } from "cantoui";
import {
  getCantoBalance,
  NativeGTokens,
  useCosmosTokens,
} from "hooks/useCosmosTokens";
import { GTokens, useGravityTokens } from "hooks/useGravityTokens";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNetworkInfo } from "stores/networkInfo";
import { selectedEmptyToken, useTokenStore } from "stores/tokens";
import BridgeIn from "./bridgeIn";
import BridgeOut from "./BridgeOut";

const BridgingPage = () => {
  const tokenStore = useTokenStore();
  const networkInfo = useNetworkInfo();
  const [bridgeIn, setBridgeIn] = useState(true);
  const { gravityTokens } = bridgeIn
    ? useGravityTokens(networkInfo.account)
    : useCosmosTokens(networkInfo.account);
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
    }, 6000);
    return () => clearInterval(interval);
  }, [gravityTokens]);

  console.log(bridgeIn, cantoGravityTokens)

  return (
    <Container>
      <Tabs className="tabs">
        <TabList className="tablist">
          <Tab
            className="tab"
            onClick={() => {
              setBridgeIn(true);
              tokenStore.setSelectedToken(selectedEmptyToken);
            }}
          >
            Bridge In
          </Tab>
          <Tab
            className="tab"
            onClick={() => {
              setBridgeIn(false);
              tokenStore.setSelectedToken(selectedEmptyToken);
            }}
          >
            Bridge Out
          </Tab>
        </TabList>
        <TabPanel>
          <BridgeIn />
        </TabPanel>
        <TabPanel>
          <BridgeOut />
        </TabPanel>
      </Tabs>
    </Container>
  );
};

const Container = styled.div`
  background-color: var(--pitch-black-color);
  border: 1px solid var(--primary-color);
  min-height: 1000px;
  width: 800px;
  margin: 4rem auto;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tabs {
    width: 100%;
  }
  .tab {
    background-color: var(--pitch-black-color);
    height: 50px;
    color: var(--primary-color);
    outline: none;
    width: 100%;
    border-radius: 0%;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--primary-color);
    cursor: pointer;
    font-size: 22px;

    &:hover {
      background-color: #283b2d;
    }
  }
  .tablist {
    display: flex;
    justify-content: space-between;
  }
  .react-tabs__tab--selected {
    border: 1px solid var(--primary-color);
    border-top: none;
    background-color: #1e2d22;
  }
  .react-tabs__tab--disabled {
  }
`;

export default BridgingPage;

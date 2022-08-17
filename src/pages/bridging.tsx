import styled from "@emotion/styled";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import BridgeIn from "./bridgeIn";
import BridgeOut from "./BridgeOut";

const BridgingPage = () => {
  return (
    <Container>
      <Tabs className="tabs">
        <TabList className="tablist">
          <Tab className="tab">Bridge In</Tab>
          <Tab className="tab">Bridge Out</Tab>
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
  margin: 0 auto;
  color: white;
  margin-top: 4rem;
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

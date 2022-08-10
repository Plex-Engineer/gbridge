import right from "assets/right.svg";
import canto from "assets/logo.svg";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Mixpanel } from "./../mixpanel";
import { BigNumber } from "ethers";
import { useGravityTokens } from "hooks/useGravityTokens";
import { useNetworkInfo } from "stores/networkInfo";
import { useTokenStore } from "stores/tokens";
import { ReactiveButton } from "./ReactiveButton";
import { useApprove, useCosmos } from "./useTransactions";
import { TokenWallet } from "./TokenSelect";
import { Container, Balance } from "./styledComponents";
import { ImageButton } from "./ImageButton";
import { TOKENS, ADDRESSES, Button, CantoMainnet } from "cantoui";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useCosmosTokens } from "hooks/useCosmosTokens";
import { chain, fee, memo } from "config/networks";
import {txConvertERC20} from "utils/convertCoin/convertTransactions.js"

const BridgePage = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const activeToken = useTokenStore().selectedToken;
  const [amount, setAmount] = useState("");

  const [bridgeOut, setBridgeOut] = useState(false);

  //get tokens from the contract call
  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account,
    Number(networkInfo.chainId)
  );
  const {cantoTokens} = useCosmosTokens(networkInfo.account, Number(networkInfo.chainId))

  //contracts for transactions
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
    // tokenStore.setSelectedToken(gravityTokens?.find(item => item.data.address == tokenStore.selectedToken.data.address))
      tokenStore.setSelectedToken({
        ...tokenStore.selectedToken, allowance : Number.MAX_VALUE
      })
      setTimeout(() => {
        resetApprove();
      }, 1000);
    }
    
  }, [stateApprove.status]);

  useEffect(() => {
    tokenStore.setCosmosStatus(stateCosmos.status);
  }, [stateCosmos.status]);

  //send function
  const send = () => {
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

  Mixpanel.events.pageOpened("Bridge", activeToken.wallet);

  // =========================
  return (
    <Container>
      {/* <Tabs 
        disabledTabClassName="disabled"
        selectedTabClassName="selected"
        className={"tabs"}>
          <TabList className={"tablist"}>
            <Tab className={"tab"} selectedClassName="tab-selected">bridge in</Tab>
            <Tab className={"tab"} selectedClassName="tab-selected">bridge out</Tab>
          </TabList>
          <TabPanel>
            <BridgeOutPage></BridgeOutPage>
          </TabPanel>
      </Tabs> */}
      <h1
        hidden={networkInfo.hasPubKey}
        style={{
          color: "#b73d3d",
          fontWeight: "bold",
          paddingTop: "15px",
          textShadow: "0px 0px black",
        }}
      >
        please{" "}
        <a
          href="https://account.canto.io"
          style={{ color: "red", textDecoration: "underline" }}
        >
          generate public key
        </a>{" "}
        before bridging assets
      </h1>
      <h1
        style={{
          margin: "2rem",
        }}
      >
        send funds {bridgeOut ? "from" : "to"} canto
      </h1>
      <div
        className="row"
        style={{
          border: "1px solid #444",
          padding: ".1rem 1rem",
          marginBottom: "1rem",
          width: "40rem",
          justifyContent: "space-around",
        }}
      >
        <div className="wallet-item">
          <img src={TOKENS.ETHMainnet.WETH.icon} alt="eth" width={26} />
          <p>{bridgeOut ? "gravity bridge" : "ethereum"}</p>
        </div>
        <img
          src={right}
          height={30}
          style={{
            margin: "1rem 1rem 1rem 0rem",
            transform: bridgeOut ? "rotate(180deg)" : ""
          }}
          onClick={() => setBridgeOut(!bridgeOut)}
        />
        <div className="wallet-item">
          <img src={canto} alt="eth" width={26} />
          <p>canto</p>
        </div>
      </div>
      <ImageButton name="connect" networkSwitch={bridgeOut ? CantoMainnet.chainId : 1} />
      <br></br>
      <h4 style={{ color: "white" }}>
        canto address:{" "}
        {networkInfo.cantoAddress
          ? networkInfo.cantoAddress.slice(0, 10) +
            "..." +
            networkInfo.cantoAddress.slice(-5)
          : "retrieving wallet"}
      </h4>
      <Balance>
        <TokenWallet
          tokens={bridgeOut ? cantoTokens : gravityTokens}
          activeToken={tokenStore.selectedToken}
          onSelect={(value) => {
            tokenStore.setSelectedToken(value);
            resetCosmos();
            resetApprove();
          }}
        />
        <input
          className="amount"
          autoComplete="off"
          type="text"
          name="amount"
          id="amount"
          value={amount}
          placeholder="0.00"
          onChange={(e) => {
            if (
              !(stateApprove.status == "PendingSignature" ||
              stateCosmos.status == "PendingSignature" ||
              stateApprove.status == "Mining" ||
              stateCosmos.status == "Mining")
            ) {
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setAmount(e.target.value);
              }
              resetCosmos();
              resetApprove();
            }
          }}
        />
      </Balance>

      <ReactiveButton
        destination={networkInfo.cantoAddress}
        amount={amount}
        account={networkInfo.account}
        token={tokenStore.selectedToken}
        gravityAddress={gravityAddress}
        hasPubKey={networkInfo.hasPubKey}
        onClick={bridgeOut ? async () => {
          await txConvertERC20(
            tokenStore.selectedToken.data.address,
            ethers.utils.parseUnits(amount, tokenStore.selectedToken.data.decimals).toString(),
            networkInfo.cantoAddress,
            CantoMainnet.cosmosAPIEndpoint,
            fee,
            chain,
            memo
          )
        } : send}
      />
      <br></br>
      <div 
      style={{color: "white", padding: "1rem", textAlign: "center"}}
      >
      it takes several minutes for your bridged assets to arrive on the canto network. 
      go to the <a href="https://convert.canto.io" style={{color: "white", textDecoration: "underline"}}>convert coin</a> page to view your bridged assets and convert them into canto ERC20 tokens to view your assets in Metamask. 
      for more details, please read <a href="https://canto.gitbook.io/canto/user-guides/bridging-assets-to-canto/transfering-canto-assets-to-canto-evm" style={{color: "white", textDecoration: "underline"}}>here</a>.
      </div>
      <br></br>
      <div
        style={{
          color: "var(--primary-color)",
          textAlign: "center",
          width: "100%",
        }}
      >
        powered by Gravity Bridge
      </div>
    </Container>
  );
};

export default BridgePage;

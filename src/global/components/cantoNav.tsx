import { useEthers } from "@usedapp/core";
import { CantoMainnet, useAlert, NavBar } from "cantoui";
import { getAccountBalance, getChainIdandAccount } from "global/utils/walletConnect/addCantoToWallet";
import { GenPubKey } from "pages/genPubKey";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { addNetwork } from "utils/addCantoToWallet";
import logo from "./../../assets/logo.svg"

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const { activateBrowserWallet, account, chainId } = useEthers();
  const alert = useAlert();

  useEffect(() => {
    netWorkInfo.setChainId(chainId?.toString());
    netWorkInfo.setAccount(account);
}, [account, chainId]);

  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }

  async function getBalance() {
    if (netWorkInfo.account != undefined) {
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account))
    }
  }
  const [closedAlert, setClosedAlert] = useState(false);
  useEffect(() => {
    if (!closedAlert) {
      alert.show("Warning", <h3 onClick={() => {
        alert.close();
        setClosedAlert(true);
        }} style={{textAlign: "center", color: "yellow"}}>gravity bridge is currently paused for the ethereum merge. for more infomration read {" "}
      <a style={{textDecoration: "underline", color: "yellow"}} href="https://github.com/Gravity-Bridge/Gravity-Docs/blob/main/docs/eth-merge-faq.md#ethereum-merge-faq">
        here
      </a>
    </h3>)
    } else if (!netWorkInfo.hasPubKey) {
      alert.show("Failure", <GenPubKey />)
    } else if (!netWorkInfo.account) {
      alert.show("Failure", <p> please connect your wallet to use the bridge</p>)
    }else if (!netWorkInfo.isConnected) {
      alert.show("Failure", <p>this network is not supported on gravity bridge, please <a onClick={addNetwork} style={{cursor: "pointer", textDecoration: "underline"}}>switch networks</a></p>)
    } else {
      alert.close();
    }
    getBalance();
  },[netWorkInfo.account, netWorkInfo.chainId, netWorkInfo.hasPubKey, closedAlert]);

  const pageList = [
    {
      name: "bridge",
      link: "https://bridge.canto.io",
    },
    {
      name: "convert coin",
      link: "https://convert.canto.io"
    },
    {
      name: "staking",
      link: "https://staking.canto.io",
    },
    {
      name: "lp interface",
      link: "https://lp.canto.io",
    },
    {
      name: "lending",
      link: "https://lending.canto.io",
    },
    {
      name: "governance",
      link: "https://governance.canto.io",
    },
  ];

  return (
    <NavBar
      onClick={() => {
        activateBrowserWallet();
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={account ? true : false}
      balance={netWorkInfo.balance}
      currency={Number(netWorkInfo.chainId) == CantoMainnet.chainId ? "CANTO" : "ETH"}
      logo={logo}
      currentPage="bridge"
      pageList={pageList}
    />
  );
};
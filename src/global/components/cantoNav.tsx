import { useEthers } from "@usedapp/core";
import { NavBar, useAlert } from "cantoui";
import {
  getAccountBalance,
  getChainIdandAccount,
} from "global/utils/walletConnect/addCantoToWallet";
import { GenPubKey } from "pages/genPubKey";
import { useEffect } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { addNetwork } from "utils/addCantoToWallet";
import logo from "./../../assets/logo.svg";

export const CantoNav = () => {
  const netWorkInfo = useNetworkInfo();
  const { activateBrowserWallet, account, switchNetwork, chainId } = useEthers();
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
      netWorkInfo.setBalance(await getAccountBalance(netWorkInfo.account));
    }
  }
  useEffect(() => {
    if (!netWorkInfo.isConnected) {
      alert.show(
        "Failure",
        <p>
          this network is not supported on gravity bridge, please{" "}
          <a
            onClick={addNetwork}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            switch networks
          </a>
        </p>
      );
    } else if (!netWorkInfo.hasPubKey) {
      alert.show("Failure", <GenPubKey />)
    } else{
      alert.close();
    }
    getBalance();
  }, [netWorkInfo.account, netWorkInfo.chainId, netWorkInfo.hasPubKey]);


  return (
    <NavBar
      title="bridge"
      onClick={() => {
        activateBrowserWallet();
        switchNetwork(1);
      }}
      chainId={Number(netWorkInfo.chainId)}
      account={netWorkInfo.account ?? ""}
      isConnected={netWorkInfo.isConnected && account ? true : false}
      balance={netWorkInfo.balance}
      currency={netWorkInfo.chainId == "1" ? "ETH" : "CANTO"}
      logo={logo}
      currentPage="bridge"
    />
  );
};

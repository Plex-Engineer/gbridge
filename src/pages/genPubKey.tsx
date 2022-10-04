import { useEthers } from "@usedapp/core";
import { CantoMainnet } from "cantoui";
import { useEffect, useState } from "react";
import { useNetworkInfo } from "stores/networkInfo";
import { addNetwork } from "utils/addCantoToWallet";
import { generatePubKey } from "utils/nodeTransactions";

export const GenPubKey = () => {
  const [pubKeySuccess, setPubKeySuccess] = useState("");
  const [wasNotConnected, setWasNotConnected] = useState(false);
  const networkInfo = useNetworkInfo();
  const {activateBrowserWallet} = useEthers();
  useEffect(() => {
    if (
      Number(networkInfo.chainId) == CantoMainnet.chainId &&
      wasNotConnected == true
    ) {
      setPubKeySuccess(
        "connected to canto network! click above to generate a public key"
      );
    }
  }, [networkInfo.chainId]);
  return (
    <div
      style={{
        color: "#b73d3d",
        fontWeight: "bold",
        textShadow: "0px 0px black",
      }}
    >
      <p hidden={networkInfo.hasPubKey}>
        please{" "}
        <a
          style={{
            color: "red",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => {
            if (!networkInfo.account) {
              setPubKeySuccess("please connect wallet");
              activateBrowserWallet();
            } else if (Number(networkInfo.chainId) != CantoMainnet.chainId) {
              addNetwork();
              setPubKeySuccess("switch to canto network");
              setWasNotConnected(true);
            } else {
              generatePubKey(networkInfo.account, setPubKeySuccess);
            }
          }}
        >
          generate a public key
        </a>{" "}
        before bridging assets
      </p>
      <p>{pubKeySuccess}</p>
      <div>*in order to generate a public key, you must have at least 0.5 CANTO or 0.01 ETH on mainnet*</div>
    </div>
  );
};

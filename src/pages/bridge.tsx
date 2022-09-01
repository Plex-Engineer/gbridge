import sendImg from "assets/send.svg";
import ATOMTOKEN from "assets/icons/ATOM.svg";
import canto from "assets/logo.svg";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Mixpanel } from "./../mixpanel";
import { useGravityTokens } from "hooks/useGravityTokens";
import { useNetworkInfo } from "stores/networkInfo";
import { selectedEmptyToken, useTokenStore } from "stores/tokens";
import { ReactiveButton } from "./ReactiveButton";
import { TokenWallet } from "./TokenSelect";
import { Container, Balance, Center, Button } from "./styledComponents";
import { ImageButton } from "./ImageButton";
import { TOKENS, ADDRESSES, CantoMainnet } from "cantoui";
import { getCantoBalance } from "hooks/useCosmosTokens";
import { chain, fee, memo } from "config/networks";
import { txIBCTransfer } from "utils/IBC/IBCTransfer";
import { toast } from "react-toastify";

const BridgePage = () => {
  const [gravReceiver, setGravReceiver] = useState("");
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const activeToken = useTokenStore().selectedToken;
  const [amount, setAmount] = useState("");

  const [cantoTokens, setCantoTokens] = useState<any[]>([]);

  function copyAddress(value: string | undefined) {
    navigator.clipboard.writeText(value ?? "");
    toast("copied address", {
      autoClose: 300,
    });
  }

  useEffect(() => {
    if (networkInfo.cantoAddress) {
      getBalances();
    }
  }, [networkInfo.cantoAddress]);

  Mixpanel.events.pageOpened("Bridge", activeToken.wallet);

  async function getBalances() {
    const tokensWithBalances = await getCantoBalance(
      CantoMainnet.cosmosAPIEndpoint,
      networkInfo.cantoAddress
    );
    setCantoTokens(tokensWithBalances);
  }

  // =========================
  return (
    <Container>
      <h1
        style={{
          margin: "2rem",
        }}
      >
        send ATOM from canto to cosmos hub
      </h1>
      <div
        className="row"
        style={{
          border: "1px solid #444",
          marginBottom: "1rem",
          width: "40rem",
          justifyContent: "space-around",
          flexDirection: "column-reverse",
        }}
      >
        <div className="wallet-item">
          <h3>{"to:"}</h3>
          <Center className="center">
            <img src={ATOMTOKEN} alt="atom" width={26} />
            <p>{"cosmos hub"}</p>
          </Center>
          <h4
            style={{ color: "white", textAlign: "right", cursor: "pointer" }}
            id="ethAddress"
            onClick={() => copyAddress(networkInfo.account)}
          ></h4>
        </div>
        <div className="switchBtn">
          <Center>
            <img
              className="imgBtn"
              src={sendImg}
              height={40}
              style={{
                transition: "transform .3s",
              }}
            />
          </Center>
          <hr />
        </div>
        <div className="wallet-item">
          <h3>from:</h3>
          <Center className="center">
            <img src={canto} alt="canto" height={26} width={26} />
            <p>canto</p>
          </Center>
          <h4
            style={{ color: "white", textAlign: "right", cursor: "pointer" }}
            id="cantoAddress"
            onClick={() => copyAddress(networkInfo.cantoAddress)}
          >
            {networkInfo.cantoAddress
              ? networkInfo.cantoAddress.slice(0, 10) +
                "..." +
                networkInfo.cantoAddress.slice(-5)
              : "retrieving wallet"}
          </h4>
        </div>
      </div>
      <ImageButton name="connect" networkSwitch={CantoMainnet.chainId} />
      {Number(networkInfo.chainId) != CantoMainnet.chainId ? (
        <div />
      ) : (
        <div className="column">
          <Balance>
            <TokenWallet
              tokens={cantoTokens}
              activeToken={tokenStore.selectedToken}
              onSelect={(value) => {
                tokenStore.setSelectedToken(value);
              }}
            />
            <div style={{ marginTop: "1.5rem" }}>
              <input
                className="amount"
                autoComplete="off"
                type="text"
                name="amount"
                id="amount"
                value={amount}
                placeholder="0.00"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val)) {
                    setAmount(e.target.value);
                  }
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  color: "gray",
                  paddingTop: "0rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setAmount(tokenStore.selectedToken.balanceOf);
                }}
              >
                {Number(tokenStore.selectedToken.balanceOf) < 0
                  ? ""
                  : "max " + tokenStore.selectedToken.balanceOf}
              </div>
            </div>
          </Balance>
          <div className="input">
            <label htmlFor="address">cosmos hub address: </label>

            <input
              className="amount"
              autoComplete="off"
              type="text"
              name="address"
              id="address"
              value={gravReceiver}
              placeholder="cosmos..."
              onChange={(e) => {
                setGravReceiver(e.target.value);
              }}
              style={{ width: "120%" }}
            />
          </div>

          <ReactiveButton
            destination={networkInfo.cantoAddress}
            amount={amount}
            account={networkInfo.account}
            token={tokenStore.selectedToken}
            gravityAddress={""}
            hasPubKey={networkInfo.hasPubKey}
            disabled={gravReceiver.slice(0, 6) != "cosmos"}
            onClick={async () => {
              const response = await txIBCTransfer(
                gravReceiver,
                "channel-2",
                ethers.utils
                  .parseUnits(amount, tokenStore.selectedToken.data.decimals)
                  .toString(),
                tokenStore.selectedToken.data.nativeName,
                CantoMainnet.cosmosAPIEndpoint,
                "https://api.cosmos.network/cosmos",
                fee,
                chain,
                memo
              );
              if (response.tx_response?.txhash) {
                toast("bridge out successful", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progressStyle: {
                    color: "var(--primary-color)",
                  },
                  style: {
                    border: "1px solid var(--primary-color)",
                    borderRadius: "0px",
                    paddingBottom: "3px",
                    background: "black",
                    color: "var(--primary-color)",
                    height: "100px",
                    fontSize: "20px",
                  },
                });
              } else {
                //TODO: Show an error
              }
            }}
          />
        </div>
      )}
      <br></br>
      <div style={{ color: "white" }}>
        this page is only for bridging ATOM from canto to the cosmos hub
      </div>
      <br />
      <p style={{ color: "white" }}>
        to learn how to bridge ATOM into canto, please read{" "}
        <a
          style={{ color: "white" }}
          href="https://docs.canto.io/user-guides/bridging-assets/bridging-atom-greater-than-canto-via-ibc-transfer"
        >
          here
        </a>{" "}
      </p>
      <br />
    </Container>
  );
};

export default BridgePage;

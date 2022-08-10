import { useEthers } from "@usedapp/core";
import { ETHMainnet } from "config/networks";
import { useNetworkInfo } from "stores/networkInfo";

interface IWallet {
    image?: string;
    name: string;
    onSelect?: (value: any) => void;
    networkSwitch: number;
  }
  
  export const ImageButton = ({ image, name, networkSwitch }: IWallet) => {

  const { activateBrowserWallet, switchNetwork } = useEthers();
  const networkInfo = useNetworkInfo();

      return (

          <div
              className="image-button button"
              onClick={async () => {
                  //1 for ethereum mainnet, 15 for gravity bridge testnet
                  activateBrowserWallet();

                  if (Number(networkInfo.chainId) != networkSwitch)
                      switchNetwork(networkSwitch);
              } }
              style={{
                  backgroundColor: "#1C1C1C",
                  padding: "1rem 1.4rem",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  width: "20rem",
                  cursor: "pointer",
              }}
          >
              {image ? <img src={image} alt={name} height={24} width={24} /> : null}
              <span
                  style={{
                      flex: "2",
                      textAlign: "center",
                  }}
              >
                  {networkInfo.account
                      ? Number(networkInfo.chainId) != networkSwitch
                          ? "switch network"
                          : networkInfo.account.substring(0, 10) +
                          "..." +
                          networkInfo.account.substring(networkInfo.account.length - 10, networkInfo.account.length)
                      : "connect"}
              </span>
          </div>
      );
  };
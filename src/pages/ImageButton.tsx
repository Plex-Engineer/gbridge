import { useEthers } from "@usedapp/core";
import { useNetworkInfo } from "stores/networkInfo";
import { addEthMainToWallet, addNetwork } from "utils/addCantoToWallet";

interface IWallet {
    image?: string;
    name: string;
    onSelect?: (value: any) => void;
    networkSwitch: number;
  }
  
  export const ImageButton = ({ image, name, networkSwitch }: IWallet) => {

  const networkInfo = useNetworkInfo();
  console.log(window)

      return (

          <div
              className="image-button button"
              onClick={async () => {
                  //1 for ethereum mainnet, 15 for gravity bridge testnet
                  networkSwitch == 1 ? addEthMainToWallet() : addNetwork();
              } 
            }
              style={{
                  backgroundColor: "#1C1C1C",
                  padding: "1rem 1.4rem",
                  marginTop : "1rem",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  width: "20rem",
                  cursor: "pointer",
                //   border: Number(networkInfo.chainId) == networkSwitch ? "" : "1px solid yellow",
                // boxShadow:" 0 1px 0 #000000, 0 5px 0 #000000, 0 6px 6px #ff0000"
              }}
          >
              {image ? <img src={image} alt={name} height={24} width={24} /> : null}
              <span
                  style={{
                      flex: "2",
                      textAlign: "center",
                  }}
              >
                  {Number(networkInfo.chainId) != networkSwitch ? networkSwitch == 1
                          ? "switch to ethereum network" : "switch to canto network" : 
                          !networkInfo.account ? ""
                          : networkInfo.account.substring(0, 10) +
                          "..." +
                          networkInfo.account.substring(networkInfo.account.length - 10, networkInfo.account.length)
                      }
              </span>
          </div>
      );
  };
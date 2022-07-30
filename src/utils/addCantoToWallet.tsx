import { ethers } from "ethers";
import { CantoMain } from "constants/networks";


export function getChainIdandAccount(): string[] | undefined[] {
  //@ts-ignore
  if (window.ethereum) {
    //@ts-ignore
    return [window.ethereum.networkVersion, window.ethereum.selectedAddress];
  }
  return [undefined, undefined];
}
export async function connect() {
    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      window.ethereum.request({method: "eth_requestAccounts"});
    }
    addEthMainToWallet();
  }

export async function getAccountBalance(account: string | undefined) {
    //@ts-ignore
    if (window.ethereum) {
        //@ts-ignore
        let balance = await window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
        return ethers.utils.formatEther(balance);
    }
    return "0";
 
}

function addEthMainToWallet () {
    //@ts-ignore 
    if (window.ethereum) {
        //@ts-ignore
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: "0x1",
            }]
        })
    }
}
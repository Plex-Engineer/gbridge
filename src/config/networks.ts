import {
  gravityTokenBase,
  mainnetGravityTokensBase,
} from "./gravityBridgeTokens";
import { ADDRESSES } from "cantoui";


//Gravity Bridge Chains
export const ETHMainnet = {
  name: "Etheruem Mainnet",
  symbol: "ETH",
  chainId: 1,
  addresses: ADDRESSES.ETHMainnet,
  gravityTokens: mainnetGravityTokensBase,
  rpcUrl: "https://mainnet.infura.io/v3/e5a334de8167419aaa717a990033db27",
  isTestChain: false,
  blockExplorerUrl: "https://www.nothing.com",
};

export const GravityTestnet = {
  name: "Gravity Bridge Testnet",
  symbol: "DIODE",
  chainId: 15,
  addresses: ADDRESSES.gravityBridgeTest,
  gravityTokens: gravityTokenBase,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
};

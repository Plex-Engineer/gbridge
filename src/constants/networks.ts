import { Gravity } from "providers/index";
import {
  gravityTokenBase,
  mainnetGravityTokensBase,
} from "./gravityBridgeTokens";
import addresses from "constants/addresses";


export const CantoMain = {
  name: "Canto Mainnet",
  symbol: "CANTO",
  chainId: 7700,
  addresses: addresses.cantoMainnet,
  rpcUrl: "https://evm.plexnode.wtf",
  cosmosAPIEndpoint: "https://cosmos.plexnode.wtf/",
  isTestChain: false,
  blockExplorerUrl: "https://www.nothing.com",
};

export const CantoTest = {
  name: "Canto Testnet",
  symbol: "CANTO",
  chainId: 740,
  addresses: addresses.testnet,
  rpcUrl: "https://eth.plexnode.wtf",
  cosmosAPIEndpoint: "https://chain.plexnode.wtf/",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
};

//Gravity Bridge Chains
export const ETHMainnet = {
  name: "Etheruem Mainnet",
  symbol: "ETH",
  chainId: 1,
  addresses: addresses.ETHMainnet,
  gravityTokens: mainnetGravityTokensBase,
  rpcUrl: "https://mainnet.infura.io/v3/e5a334de8167419aaa717a990033db27",
  isTestChain: false,
  blockExplorerUrl: "https://www.nothing.com",
};

export const GravityTestnet = {
  name: "Gravity Bridge Testnet",
  symbol: "DIODE",
  chainId: 15,
  addresses: addresses.gravityBridgeTest,
  gravityTokens: gravityTokenBase,
  rpcUrl: "https://testnet.gravitychain.io",
  isTestChain: true,
  blockExplorerUrl: "https://www.nothing.com",
};

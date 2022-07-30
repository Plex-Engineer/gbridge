import { Gravity, } from "providers/index";
import { gravityTokenBase, mainnetGravityTokensBase } from "./gravityBridgeTokens";
import addresses from "constants/addresses"
import { Mainnet as ETHMain } from "@usedapp/core";

export const networkProperties = [
    {
        name: "Etheruem Mainnet",
        symbol: "ETH",
        testnet: false,
        chainId: ETHMain.chainId,
        gravityTokens: mainnetGravityTokensBase,
        addresses: addresses.ETHMainnet,
        chainInfo: ETHMain,
      },
    {
        name: "Gravity Bridge Testnet",
        symbol: "DIODE",
        testnet: true,
        chainId: Gravity.chainId,
        gravityTokens: gravityTokenBase,
        addresses: addresses.gravityBridgeTest,
        chainInfo: Gravity
      },
]
import { TOKENS } from "cantoui"
import USDC from "assets/icons/USDC.svg";
import USDT from "assets/icons/USDT.svg";
import WETH from "assets/icons/ETH.svg";

export const gravityTokenBase = [
TOKENS.GravityBridge.E2H,
TOKENS.GravityBridge.BYE,
TOKENS.GravityBridge.MAX
]

export const mainnetGravityTokensBase = [
TOKENS.ETHMainnet.USDC,
TOKENS.ETHMainnet.USDT,
TOKENS.ETHMainnet.WETH
]

const IBCTokens = {
    USDC: 'ibc/17CD484EE7D9723B847D95015FA3EBD1572FD13BC84FB838F55B18A57450F25B',
    USDT: 'ibc/4F6A2DEFEA52CD8D90966ADCB2BD0593D3993AB0DF7F6AEB3EFD6167D79237B0',
    ETH: 'ibc/DC186CA7A8C009B43774EBDC825C935CABA9743504CE6037507E6E5CCE12858A'
}

export const CantoGravityTokens = [
    {...TOKENS.cantoMainnet.USDT, 
        nativeName : IBCTokens.USDT}, // mapping to the actual native token name,
    {...TOKENS.cantoMainnet.USDC,
        nativeName : IBCTokens.USDC},
    {...TOKENS.cantoMainnet.ETH,
        nativeName : IBCTokens.ETH}
];

export const ETHGravityTokens = [
    {...TOKENS.ETHMainnet.USDC,
        nativeName: IBCTokens.USDC 
    },
    {...TOKENS.ETHMainnet.USDT, 
        nativeName: IBCTokens.USDT 
    },
    {...TOKENS.ETHMainnet.WETH, 
        nativeName: IBCTokens.ETH 
    }
]

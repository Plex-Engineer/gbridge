import { Token, TOKENS, decimals } from "./tokens";
import ADDRESSES from "./addresses";

export interface PAIR {
    address: string,
    cLPaddress: string
    token1: Token,
    token2: Token,
    decimals: number,
    stable: boolean,
}

export const TESTPAIRS: PAIR[] = [
    {
        address: ADDRESSES.testnet.CantoNoteLP,
        cLPaddress: ADDRESSES.testnet.cCantoNoteLP,
        token1: TOKENS.cantoTestnet.WCANTO,  // CANTO,
        token2: TOKENS.cantoTestnet.NOTE,  // NOTE,
        decimals: decimals.CantoNoteLP,
        stable: false
    },
    {
        address: ADDRESSES.testnet.CantoETHLP,
        cLPaddress: ADDRESSES.testnet.cCantoETHLP,
        token1: TOKENS.cantoTestnet.WCANTO,  // CANTO,
        token2: TOKENS.cantoTestnet.ETH,  // ETH,
        decimals: decimals.CantoETHLP,
        stable: false
    },
    {
        address: ADDRESSES.testnet.CantoAtomLP,
        cLPaddress: ADDRESSES.testnet.cCantoAtomLP,
        token1: TOKENS.cantoTestnet.WCANTO,  // CANTO,
        token2: TOKENS.cantoTestnet.ATOM,  // ATOM,
        decimals: decimals.CantoAtomLP,
        stable: false
    },
    {
        address: ADDRESSES.testnet.NoteUSDCLP,
        cLPaddress: ADDRESSES.testnet.cNoteUSDCLP,
        token1: TOKENS.cantoTestnet.NOTE,   // NOTE,
        token2: TOKENS.cantoTestnet.USDC,  // USDC,
        decimals: decimals.NoteUSDCLP,
        stable: true
    },
    {
        address: ADDRESSES.testnet.NoteUSDTLP,
        cLPaddress: ADDRESSES.testnet.cNoteUSDTLP,
        token1: TOKENS.cantoTestnet.NOTE,  // NOTE,
        token2: TOKENS.cantoTestnet.USDT,   // USDT,
        decimals: decimals.NoteUSDTLP,
        stable: true
    }
];
export const MAINPAIRS: PAIR[] = [
    {
        address: ADDRESSES.cantoMainnet.CantoNoteLP,
        cLPaddress: ADDRESSES.cantoMainnet.cCantoNoteLP,
        token1: TOKENS.cantoMainnet.WCANTO,  // CANTO,
        token2: TOKENS.cantoMainnet.NOTE,  // NOTE,
        decimals: decimals.CantoNoteLP,
        stable: false
    },
    {
        address: ADDRESSES.cantoMainnet.CantoETHLP,
        cLPaddress: ADDRESSES.cantoMainnet.cCantoETHLP,
        token1: TOKENS.cantoMainnet.WCANTO,  // CANTO,
        token2: TOKENS.cantoMainnet.ETH,  // ETH,
        decimals: decimals.CantoETHLP,
        stable: false
    },
    {
        address: ADDRESSES.cantoMainnet.CantoAtomLP,
        cLPaddress: ADDRESSES.cantoMainnet.cCantoAtomLP,
        token1: TOKENS.cantoMainnet.WCANTO,  // CANTO,
        token2: TOKENS.cantoMainnet.ATOM,  // ATOM,
        decimals: decimals.CantoAtomLP,
        stable: false
    },
    {
        address: ADDRESSES.cantoMainnet.NoteUSDCLP,
        cLPaddress: ADDRESSES.cantoMainnet.cNoteUSDCLP,
        token1: TOKENS.cantoMainnet.NOTE,   // NOTE,
        token2: TOKENS.cantoMainnet.USDC,  // USDC,
        decimals: decimals.NoteUSDCLP,
        stable: true
    },
    {
        address: ADDRESSES.cantoMainnet.NoteUSDTLP,
        cLPaddress: ADDRESSES.cantoMainnet.cNoteUSDTLP,
        token1: TOKENS.cantoMainnet.NOTE,  // NOTE,
        token2: TOKENS.cantoMainnet.USDT,   // USDT,
        decimals: decimals.NoteUSDTLP,
        stable: true
    }
];
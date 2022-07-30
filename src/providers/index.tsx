import { HelmetProvider } from "react-helmet-async";
import { DAppProvider, Config, Mainnet as ETHMain } from "@usedapp/core";
import React from "react";
import TransactionStatusProvider from "./transactionContext";
import { Chain } from "@usedapp/core";
import {ETHMainnet, GravityTestnet} from "constants/networks"

interface IProviderProps {
  children: React.ReactNode;
}

export const getAddressLink = (explorerUrl: string) => (address: string) => `${explorerUrl}/address/${address}`

export const getTransactionLink = (explorerUrl: string) => (txnId: string) => `${explorerUrl}/tx/${txnId}`


export const Gravity: Chain = {
  chainId: GravityTestnet.chainId,
  chainName: GravityTestnet.name,
  isTestChain: GravityTestnet.isTestChain,
  isLocalChain: false,
  multicallAddress: '0x8a0540d474E8D1a96D1c5e5a138232D83f19c6aF',
  multicall2Address: '0x95a76bC37Eca834143E61d9F8c8F32da01BdeA1B',
  blockExplorerUrl: GravityTestnet.blockExplorerUrl,
  getExplorerAddressLink: getAddressLink("kovanEtherscanUrl"),
  getExplorerTransactionLink: getTransactionLink("kovanEtherscanUrl"),
  rpcUrl: GravityTestnet.rpcUrl
}




const config: Config = {
  networks: [Gravity, ETHMain],
  readOnlyUrls: {
    [Gravity.chainId]: GravityTestnet.rpcUrl,
    [ETHMain.chainId]: ETHMainnet.rpcUrl,
  },
  noMetamaskDeactivate: true,
};

//All the providers are wrapped in this provider function
const Provider = ({ children }: IProviderProps) => {
  return (
    <DAppProvider config={config}>
      <HelmetProvider>
        <TransactionStatusProvider>{children}</TransactionStatusProvider>
      </HelmetProvider>
    </DAppProvider>
  );
};

export default Provider;

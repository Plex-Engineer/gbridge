import { useCalls} from "@usedapp/core";
import { Contract } from "ethers";
import { GravityTestnet } from "config/networks";
import { CantoGravityTokens, gravityTokenBase, mainnetGravityTokensBase } from "config/gravityBridgeTokens";
import {abi } from "config/abi"
import { ethers } from "ethers";
import { ADDRESSES, CantoMainnet } from "cantoui";
import { GTokens } from "./useGravityTokens";




export function useCosmosTokens(
  account: string | undefined, chainId:number): 
  { cantoTokens : GTokens[] | undefined} {
  const tokens = chainId == CantoMainnet.chainId ? CantoGravityTokens : CantoGravityTokens;

  const calls =
    tokens?.map((token) => {
      const ERC20Contract = new Contract(token.address, abi.Erc20);

      return [
        {
          contract: ERC20Contract,
          method: "balanceOf",
          args: [account],
        },
      ];
    }) ?? [];
  const results = useCalls(calls.flat()) ?? {};

  if (account == undefined) {
    return {cantoTokens: undefined};
  }
  if(tokens == undefined){
    return {cantoTokens: [] }
  }
  const chuckSize = results.length / tokens.length;
  let processedTokens: Array<any>;
  const array_chunks = (array: any[], chunk_size: number) => {
    const rep = array.map((array) => array?.value);
    let chunks = [];

    for (let i = 0; i < array.length; i += chunk_size) {
      chunks.push(rep.slice(i, i + chunk_size));
    }
    return chunks;
  };
  if (chuckSize > 0 && results?.[0] != undefined && !results?.[0].error) {
    processedTokens = array_chunks(results, chuckSize);
    const val = processedTokens.map((tokenData, idx) => {
      const balanceOf = Number(ethers.utils.formatUnits(tokenData[0][0], tokens[idx].decimals))
      const allowance = Number.MAX_SAFE_INTEGER;
      return {
        data: tokens[idx],
        wallet: account,
        balanceOf,
        allowance
      };
    });

    if(val[0].balanceOf == undefined)
    return {cantoTokens: undefined}

    return {cantoTokens: val};
  }

  return {cantoTokens: undefined};
}

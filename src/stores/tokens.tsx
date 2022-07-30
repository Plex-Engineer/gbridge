import create from "zustand";
import { devtools } from "zustand/middleware";
import emptyToken from "assets/empty.svg";

interface TokenStore {
    tokens : any[],
    setTokens : (tokens : any[]) => void,
    selectedToken : any,
    setSelectedToken : (token : any) => void
  }
  
  export const useTokenStore = create<TokenStore>()(
    devtools((set) => ({
        tokens : [],
        setTokens : (tokens : any[]) => set({tokens: tokens}),
        selectedToken : {
            data: {
                icon: emptyToken,
                name: "select token",
                address: "0x0412C7c846bb6b7DC462CF6B453f76D8440b2609",
              },
              allowance: -1,
              balanceOf: -1,
        },
        setSelectedToken : (token : any) => set({selectedToken : token})
    }))
  );
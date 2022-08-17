import { CantoMainnet } from 'cantoui';


export async function getCantoAddressFromMetaMask(address: string | undefined) {
    const nodeURLMain = CantoMainnet.cosmosAPIEndpoint;
    const result = await fetch(
      nodeURLMain + "/ethermint/evm/v1/cosmos_account/" + address,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    console.log("setting canto address");
    let cosmosAddress = (await result.json()).cosmos_address;
    return cosmosAddress;
}
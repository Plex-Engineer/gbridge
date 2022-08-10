import { generateEndpointAccount } from '@tharsis/provider';
import { CantoMainnet } from 'cantoui';




export async function checkPubKey(bech32Address : string) {
    const endPointAccount = generateEndpointAccount(bech32Address);
    
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    try {
        const addressRawData = await fetch(
           CantoMainnet.cosmosAPIEndpoint + endPointAccount,
            options
        );
        const addressData = await addressRawData.json();
        return addressData['account']['base_account']['pub_key'] != null
    } catch {
        return false;
    }
}
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
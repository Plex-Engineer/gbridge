import { generateEndpointAccount } from '@tharsis/provider';
import ADDRESSES from 'constants/addresses';



export async function checkPubKey(bech32Address : string) {
    const endPointAccount = generateEndpointAccount(bech32Address);
    
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    try {
        const addressRawData = await fetch(
            ADDRESSES.cantoMainnet.NodeAPIEndpoint + endPointAccount,
            options
        );
        const addressData = await addressRawData.json();
        return addressData['account']['base_account']['pub_key'] != null
    } catch {
        return false;
    }
}
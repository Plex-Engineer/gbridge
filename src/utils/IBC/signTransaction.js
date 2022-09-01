import { generateEndpointAccount, generateEndpointBroadcast, generatePostBodyBroadcast, generateEndpointIBCChannels} from '@tharsis/provider';
import { createTxRawEIP712, signatureToWeb3Extension } from '@tharsis/transactions';

export async function signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddress, account) {
    const signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, JSON.stringify(msg.eipToSign)],
    });
    
    const raw = generateRawTx(chain, senderObj, signature, msg);

    const postOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: generatePostBodyBroadcast(raw),
    };

    const broadcastPost = await fetch(
        nodeAddress + generateEndpointBroadcast(),
        postOptions
    );
    const response = await broadcastPost.json();
}

function generateRawTx(chain, senderObj, signature, msg) {
    let extension = signatureToWeb3Extension(chain, senderObj, signature)
    let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
    return rawTx;
}

export async function getSenderObj(address, nodeAddress) {
    const accountCanto = await ethToCanto(address, nodeAddress);
    //console.log(accountCanto);
    const endPointAccount = generateEndpointAccount(accountCanto);
    
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    
    const addressRawData = await fetch(
        nodeAddress + endPointAccount,
        options
    );
    
    const addressData = await addressRawData.json();
    const senderObj = reformatSender(addressData['account']['base_account']);

    return senderObj;
}

async function ethToCanto(address, nodeAddress) {
    return fetch(nodeAddress+ "/ethermint/evm/v1/cosmos_account/" + address, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => response.json())
        .then(result => {
            address = result.cosmos_address
            return address;
        })
        .catch(error => console.log("error", error));
}

function reformatSender(addressData) {
    return {
        accountNumber : addressData['account_number'],
        pubkey : addressData['pub_key']['key'],
        sequence : addressData['sequence'],
        accountAddress : addressData['address'],
    }
}
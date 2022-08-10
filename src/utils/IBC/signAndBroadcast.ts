import { generateEndpointAccount, generateEndpointBroadcast, generatePostBodyBroadcast, generateEndpointProposals } from '@tharsis/provider';
import { createTxRawEIP712, signatureToWeb3Extension, createTxMsgDelegate, createTxMsgVote } from '@tharsis/transactions';
/**
 * Signs msg using metamask and broadcasts to node
 * @param {object} msg msg object
 * @param {object} senderObj sender object
 * @param {object} chain chain object
 * @param {string} nodeAddress ip address and port of node
 * @param {string} account eth hex address
 */
 export async function signAndBroadcastTxMsg(msg:any, senderObj:any, chain:any, nodeAddress:string, account:string) {
    // @ts-ignore
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
    console.log("🚀 ~ file: signAndBroadcast.ts ~ line 31 ~ signAndBroadcastTxMsg ~ response", response)
}

function generateRawTx(chain:any, senderObj:any, signature:any, msg:any) {
    let extension = signatureToWeb3Extension(chain, senderObj, signature)
    let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
    return rawTx;
}

/**
 * Uses the eth hex address, converts it to a canto address, 
 * then gets the sender object. 
 * @param {string} address The eth address
 * @param {string} nodeAddress The address of the node: xxx.xxx.x.xx:1317
 * @return {string} The sender object
 */
 export async function getSenderObj(address:string, nodeAddress:string) {
    const accountCanto = await ethToCanto(address, nodeAddress);
    const endPointAccount = generateEndpointAccount(accountCanto??"");
    
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

/**
 * Convert an eth hex address to bech32 canto address.
 * @param {string} address The eth address to convert into a canto address
 * @return {string} The converted address
 */
 async function ethToCanto(address:string, nodeAddress:string) {
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

/**
 * Reformats the addressData into senderObj
 * @param {object} addressData The eth address
 * @return {string} The sender object
 */
function reformatSender(addressData:any) {
    return {
        accountNumber : addressData['account_number'],
        pubkey : addressData['pub_key']['key'],
        sequence : addressData['sequence'],
        accountAddress : addressData['address'],
    }
}
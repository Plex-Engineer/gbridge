import { generateEndpointAccount, generateEndpointBroadcast, generatePostBodyBroadcast } from '@tharsis/provider';
import { createTxRawEIP712, signatureToWeb3Extension } from '@tharsis/transactions';
import { createTxMsgConvertERC20 } from './msgConvertERC20';

export async function txConvertERC20(erc20ContractAddress : any, amount : any, receiverCantoAddress: any, nodeAddressIP: any, fee:any, chain:any, memo:any) {
    // get metamask account address
    //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // get sender object using eth address
    const senderObj = await getSenderObj(account, nodeAddressIP);

    const params = {
        contract_address: erc20ContractAddress,
        amount: amount,
        receiverEvmosFormatted: receiverCantoAddress,
        senderHexFormatted: account,
    }
    const msg = createTxMsgConvertERC20(chain, senderObj, fee, memo, params);
    await signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddressIP, account);
}



export async function getSenderObj(address : string, nodeAddress : string) {
  const accountCanto = await ethToCanto(address, nodeAddress);
    const endPointAccount = generateEndpointAccount(accountCanto ?? "");
    
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
  
  function reformatSender(addressData : any) {
    return {
        accountNumber : addressData['account_number'],
        pubkey : addressData['pub_key']['key'],
        sequence : addressData['sequence'],
        accountAddress : addressData['address'],
    }
  }
  
  export async function signAndBroadcastTxMsg(msg: any, senderObj: any, chain: any, nodeAddress: string, account: string) {
    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
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
  
    console.log("POST OPTIONS: ", postOptions);
  
    const broadcastPost = await fetch(
        nodeAddress + generateEndpointBroadcast(),
        postOptions
    );
    const response = await broadcastPost.json();
    // console.log(response);
    }
  
  }
  function generateRawTx(chain : any, senderObj : any, signature : any, msg : any) {
    let extension = signatureToWeb3Extension(chain, senderObj, signature)
    let rawTx = createTxRawEIP712(msg.legacyAmino.body, msg.legacyAmino.authInfo, extension)
    return rawTx;
  }

  async function ethToCanto(address : string, nodeAddress: string) {
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
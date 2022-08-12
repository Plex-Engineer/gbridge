import { createMessageSend } from "@tharsis/transactions";
import { getSenderObj, signAndBroadcastTxMsg } from "./utils";
import { nodeAddress, fee, chain, memo } from "./constants";

/**
 * Transaction to send canto
 * @param {string} address address to send canto
 * @param {string} amount amount to stake in string format e.g. '30000000000000000'
 */
export async function txSend(
	destinationBech32 : string,
	senderHexAddress : string,
	senderBech32address : string,
	amount : string
) {
	const senderObj = await getSenderObj(senderBech32address, nodeAddress);
	const params = {
		destinationAddress: destinationBech32,
		amount: amount,
		denom: "acanto",
	};
	const msg = createMessageSend(chain, senderObj, fee, memo, params);
	return signAndBroadcastTxMsg(msg, senderObj, chain, nodeAddress, senderHexAddress);
}

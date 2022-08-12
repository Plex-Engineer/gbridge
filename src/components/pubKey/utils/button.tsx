import { hexToBech32, getMetamask, callBot } from "components/pubKey/utils/utils";
import { nodeAddress, botAddress } from "components/pubKey/utils/constants";
import { txSend } from "components/pubKey/utils/transactions";

import { generateEndpointAccount } from "@tharsis/provider";

export async function enterUser(
  hexAddress: string | undefined,
  setIsSuccess: (s: string) => void
) {
  if (hexAddress === undefined) {
    setIsSuccess("please connect your metamask to this page...");
    return;
  }
  setIsSuccess("please wait...");

  const bech32Address = await hexToBech32(hexAddress);

  const hasPubKey = await checkPubKey(bech32Address);
  if (hasPubKey) {
    setIsSuccess("user already has a public key for account: " + hexAddress);
    return;
  }

  // await bot call
  const botResponse = await callBot(bech32Address);

  // await generate pub key
  setIsSuccess("waiting for the metamask transaction to be signed...");
  const response = await txSend(botAddress, hexAddress, bech32Address, "1"); // await txSend to bot
  setIsSuccess("generating account...");
  const wrapper = async () => {
    const hasPubKey = await checkPubKey(bech32Address);
    if (hasPubKey) {
      setIsSuccess("account successfully generated!");
    } else {
      setIsSuccess("public key generatation was unsuccessful");
    }
  };
  setTimeout(wrapper, 8000);
}

async function checkPubKey(bech32Address: string) {
  const endPointAccount = generateEndpointAccount(bech32Address);

  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const addressRawData = await fetch(nodeAddress + endPointAccount, options);
    const addressData = await addressRawData.json();
    return addressData["account"]["base_account"]["pub_key"] != null;
  } catch {
    return false;
  }
}

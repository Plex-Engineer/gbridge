import styled from "styled-components";
import down from "assets/down.svg";
import right from "assets/right.svg";
import canto from "assets/logo.svg";
import Popup from "reactjs-popup";
import { useState } from "react";
import TokenModal from "components/modals/tokenModal";
import { Contract, ethers, utils } from "ethers";
import { abi } from "constants/abi";
import emptyToken from "assets/empty.svg";

import { useContractFunction, useEthers } from "@usedapp/core";
import { Mixpanel } from "./../mixpanel";
import { BigNumber } from "ethers";
import { useGravityTokens } from "hooks/useGravityTokens";
import { icons } from "constants/tokens";
import ADDRESSES from "constants/addresses";
import { useNetworkInfo } from "stores/networkInfo";
import { ETHMainnet } from "constants/networks";
import { useTokenStore } from "stores/tokens";

const Container = styled.div`
  background-color: black;
  width: 800px;
  margin: 4rem auto;
  padding-bottom: 2.5rem;
  /* min-height: calc(100vh - 5rem); */
  border: 1px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 30px;
    font-weight: 300;
    line-height: 39px;
    letter-spacing: -0.1em;
    color: var(--off-white-color);
  }

  .image-button {
    border: 1px solid transparent;

    &:hover {
      background-color: #111 !important;
      border: 1px solid var(--primary-color);
    }
  }

  .disabled {
    border: 1px solid transparent;

    &:hover {
      background-color: #1c1c1c !important;
      border: 1px solid transparent;
    }
  }
  .amount {
    background-color: black;
    border: none;
    width: 240px;
    font-size: 24px;
    text-align: right;
    color: white;
    &::placeholder {
      color: #999;
    }
    &:focus {
      outline: none;
    }
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
  }

  .row {
    display: flex;
    gap: 6rem;
  }

  .wallet-item {
    display: flex;
    p {
      margin: 1rem;
      font-size: 22px;
      color: white;
    }
  }
`;

const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #333;
  padding: 1rem 1.2rem;
  width: 80%;
  margin-top: 2rem;
  p {
    color: white;
    font-size: 22px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0em;
    text-align: left;
  }
`;

const Button = styled.button`
  font-weight: 300;
  font-size: 22px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.4rem 2rem;
  border: 1px solid var(--primary-color);
  margin: 3rem auto;
  margin-bottom: 0;
  display: flex;
  align-self: center;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const DisabledButton = styled(Button)`
  background-color: #222;
  color: #999;
  border: none;
  &:hover {
    cursor: default;
    background-color: #111;
    color: #444;
  }
  cursor: default;
`;

const DestInput = styled.input`
  border: 1px solid #333;
  padding: 1rem;
  width: 35rem;
  background-color: black;
  border: none;
  font-size: 24px;
  text-align: center;
  color: white;
  &::placeholder {
    color: #999;
  }
  &:focus {
    outline: none;
  }
`;
const BridgePage = () => {
  const networkInfo = useNetworkInfo();
  const tokenStore = useTokenStore();
  const [amount, setAmount] = useState("");
  const { activateBrowserWallet, switchNetwork } = useEthers();
  const [customAddress, setCustomAddress] = useState("");

  const { gravityTokens, gravityAddress } = useGravityTokens(
    networkInfo.account,
    Number(networkInfo.chainId)
  );
  console.log(gravityTokens)

  Mixpanel.events.pageOpened("Bridge", networkInfo.account);

  const ImageButton = ({ image, name, chainID }: IWallet) => (
    <div
      className="image-button button"
      onClick={async () => {
        //1 for ethereum mainnet, 15 for gravity bridge testnet
        activateBrowserWallet();

        if (chainID != 1) switchNetwork(ETHMainnet.chainId);
      }}
      style={{
        backgroundColor: "#1C1C1C",
        padding: "1rem 1.4rem",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        width: "20rem",
        cursor: "pointer",
      }}
    >
      {image ? <img src={image} alt={name} height={24} width={24} /> : null}
      <span
        style={{
          flex: "2",
          textAlign: "center",
        }}
      >
        {networkInfo.account
          ? chainID != 1
            ? "switch to ethereum network"
            : networkInfo.account.substring(0, 10) +
              "..." +
              networkInfo.account.substring(networkInfo.account.length - 10, networkInfo.account.length)
          : "connect"}
      </span>
    </div>
  );
  // =========================
  return (
    <Container>
      <h1
        hidden={networkInfo.hasPubKey}
        style={{ color: "#b73d3d", fontWeight: "bold", paddingTop: "15px", textShadow: "0px 0px black" }}
      >
        please{" "}
        <a
          href="https://generator-canto-testnet.netlify.app/"
          style={{ color: "red" }}
        >
          generate public key
        </a>{" "}
        before bridging assets
      </h1>
      <h1
        style={{
          margin: "2rem",
        }}
      >
        send funds to canto
      </h1>
      <div
        className="row"
        style={{
          border: "1px solid #444",
          padding: ".1rem 1rem",
          marginBottom: "1rem",
          width: "40rem",
          justifyContent: "space-around",
        }}
      >
        <div className="wallet-item">
          <img src={icons.ETH} alt="eth" width={26} />
          <p>ethereum</p>
        </div>
        <img
          src={right}
          height={30}
          style={{
            margin: "1rem 1rem 1rem 0rem",
          }}
        />
        <div className="wallet-item">
          <img src={canto} alt="eth" width={26} />
          <p>canto</p>
        </div>
      </div>
      <ImageButton chainID={Number(networkInfo.chainId)} name="connect" />
      <Balance>
        <TokenWallet
          tokens={gravityTokens}
          activeToken={tokenStore.selectedToken}
          onSelect={(value) => {
            tokenStore.setSelectedToken(value);
          }}
        />
        <input
          className="amount"
          autoComplete="off"
          type="text"
          name="amount"
          id="amount"
          value={amount}
          placeholder="0.00"
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val)) {
              setAmount(e.target.value);
            }
          }}
        />
      </Balance>

      <DestInput
        autoComplete="off"
        type="text"
        name="amount"
        id="amount"
        value={customAddress}
        placeholder={
          //@ts-ignore
          networkInfo.cantoAddress
            ? "default address -> " +
              networkInfo.cantoAddress.slice(0, 7) +
              "..." +
              networkInfo.cantoAddress.slice(-5)
            : "retrieving wallet"
        }
        onChange={(e) => {
          setCustomAddress(e.target.value);
        }}
      />

      <ReactiveButton
        destination={customAddress != "" ? customAddress : networkInfo.cantoAddress}
        amount={amount}
        account={networkInfo.account}
        token={tokenStore.selectedToken}
        gravityAddress={gravityAddress}
        hasPubKey={networkInfo.hasPubKey}
      />
      <br></br>
      <br></br>
      <div
        style={{
          color: "var(--primary-color)",
          textAlign: "center",
          width: "100%",
        }}
      >
        powered by Gravity Bridge
      </div>
    </Container>
  );
};
interface RBProps {
  amount: string;
  account: string | undefined;
  token: any | undefined;
  destination: string | undefined;
  gravityAddress: string | undefined;
  hasPubKey: boolean;
}

const ReactiveButton = ({
  amount,
  destination,
  token,
  gravityAddress,
  hasPubKey,
}: RBProps) => {
  const { state: stateApprove, send: sendApprove } = useApprove(
    token.data.address
  );
  const { state: stateCosmos, send: sendCosmos } = useCosmos(
    gravityAddress ?? ADDRESSES.ETHMainnet.GravityBridge
  );
  if (token == undefined) {
    return <Button>Loading</Button>;
  }

  function getStatus(value: string, status: string) {
    switch (status) {
      case "None":
        return value;
      case "Mining":
        switch (value) {
          case "increase allowance":
            return "increasing allowance";
          case "approve":
            return "approving";
          case "send token":
            return "sending token";
        }
      case "Success":
        switch (value) {
          case "increase allowance":
            return "allowance increased";
          case "approve":
            return "approved";
          case "send token":
            return "token sent";
        }
      case "Exception":
        return "couldn't " + value;
      case "Fail":
        return "couldn't " + value;
      case "PendingSignature":
        switch (value) {
          case "increase allowance":
            return "waiting for confirmation";
          case "approve":
            return "waiting for confirmation";
          case "send token":
            return "waiting for confirmation";
        }
    }
  }
  //? refactor this into a single component
  //if the token hasn't been approved
  if (!hasPubKey) {
    return <DisabledButton>please generate public key</DisabledButton>;
  }
  if (token?.allowance == -1) {
    return <DisabledButton>Select a token</DisabledButton>;
  }
  //if the amount enter is greater than balance available in the wallet && the token has been approved
  if (Number(amount) > Number(token.balanceOf) && token.allowance != 0) {
    return <DisabledButton>insufficient funds</DisabledButton>;
  }

  //if amount entered is greater than allowance approved for the token
  if (Number(amount) <= 0 && token.allowance != 0) {
    return <DisabledButton>Enter Amount</DisabledButton>;
  }
  return (
    <Button
      onClick={() => {
        //Checking if amount enter is greater than balance available in wallet and token has been approved.
        if (!destination) return;

        if (
          (Number(amount) >= token.allowance || token.allowance <= 0) &&
          stateApprove.status == "None"
        ) {
          sendApprove(
            gravityAddress,
            BigNumber.from(
              "115792089237316195423570985008687907853269984665640564039457584007913129639935"
            )
          );
        } else if (Number(amount) > 0 && stateCosmos.status == "None") {
          sendCosmos(
            token.data.address,
            destination,
            ethers.utils.parseUnits(amount, token.data.decimals)
          );
        }
      }}
    >
      {Number(amount) > token.allowance && token.allowance != 0
        ? getStatus("increase allowance", stateApprove.status)
        : token.allowance == 0
        ? getStatus("approve", stateApprove.status)
        : getStatus("send token", stateCosmos.status)}
    </Button>
  );
};
interface IWallet {
  chainID?: Number;
  image?: string;
  name: string;
  value?: any;
  onSelect?: (value: any) => void;
}

interface ITokenSelect {
  activeToken: any;
  tokens: any[] | undefined;
  onSelect: (value: any) => void;
}

export const StyledPopup = styled(Popup)`
  // use your custom style for ".popup-overlay"

  &-overlay {
    background-color: #1f4a2c6e;
    backdrop-filter: blur(2px);
    z-index: 10;
  }

  &-content {
    background-color: black;
    border: 1px solid var(--primary-color);
  }
`;

const ChainLink = styled.div`
  color: white;
  display: flex;
  padding: 1rem;
  gap: 1rem;
  border: 1px solid black;
  cursor: pointer;
  &:hover {
    border: 1px solid var(--primary-color);
    background-color: #0c3f2a;
  }
`;

const TokenWallet = ({ activeToken, onSelect, tokens }: ITokenSelect) => {
  const [isOpen, setOpen] = useState(false);

  const Box = styled.div`
    background-color: #1c1c1c;
    padding: 1rem 1.4rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 15rem;
    cursor: pointer;
    border: 1px solid black;
    &:hover {
      border: 1px solid var(--primary-color);
    }
  `;
  return (
    <Box
      onClick={() => {
        setOpen(true);
      }}
    >
      <img
        src={activeToken.data.icon}
        alt={activeToken.data.name}
        height={30}
        width={30}
      />
      <span
        style={{
          flex: "2",
        }}
      >
        {tokens ? activeToken.data.name : "loading tokens"}
      </span>
      <img src={down} alt="" />
      {tokens ? (
        <StyledPopup
          open={isOpen}
          onClose={() => {
            setOpen(false);
          }}
        >
          <hr
            style={{
              border: "0px",
              borderBottom: "1px solid #00502C",
              marginBottom: "1rem",
            }}
          />
          <TokenModal
            tokens={tokens}
            onClose={(value) => {
              if (onSelect) onSelect(value);
              setOpen(false);
            }}
          />
        </StyledPopup>
      ) : null}
    </Box>
  );
};

export function useApprove(tokenAddress: string) {
  const erc20Interface = new utils.Interface(abi.Erc20);
  const contract = new Contract(tokenAddress, erc20Interface);

  const { state, send } = useContractFunction(contract, "approve", {
    transactionName: "Enable token",
  });
  return { state, send };
}

export function useCosmos(gravityAddress: string) {
  const cosmosInterface = new utils.Interface([
    {
      inputs: [
        { internalType: "bytes32", name: "_gravityId", type: "bytes32" },
        { internalType: "address[]", name: "_validators", type: "address[]" },
        { internalType: "uint256[]", name: "_powers", type: "uint256[]" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    { inputs: [], name: "BatchTimedOut", type: "error" },
    { inputs: [], name: "IncorrectCheckpoint", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "cumulativePower", type: "uint256" },
        { internalType: "uint256", name: "powerThreshold", type: "uint256" },
      ],
      name: "InsufficientPower",
      type: "error",
    },
    {
      inputs: [
        { internalType: "uint256", name: "newNonce", type: "uint256" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidBatchNonce",
      type: "error",
    },
    { inputs: [], name: "InvalidLogicCallFees", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "newNonce", type: "uint256" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidLogicCallNonce",
      type: "error",
    },
    { inputs: [], name: "InvalidLogicCallTransfers", type: "error" },
    { inputs: [], name: "InvalidSendToCosmos", type: "error" },
    { inputs: [], name: "InvalidSignature", type: "error" },
    {
      inputs: [
        { internalType: "uint256", name: "newNonce", type: "uint256" },
        { internalType: "uint256", name: "currentNonce", type: "uint256" },
      ],
      name: "InvalidValsetNonce",
      type: "error",
    },
    { inputs: [], name: "LogicCallTimedOut", type: "error" },
    { inputs: [], name: "MalformedBatch", type: "error" },
    { inputs: [], name: "MalformedCurrentValidatorSet", type: "error" },
    { inputs: [], name: "MalformedNewValidatorSet", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "_cosmosDenom",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_tokenContract",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_symbol",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "_decimals",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "ERC20DeployedEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "_invalidationId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_invalidationNonce",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes",
          name: "_returnData",
          type: "bytes",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "LogicCallEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_tokenContract",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_destination",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "SendToCosmosEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_batchNonce",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
      ],
      name: "TransactionBatchExecutedEvent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_newValsetNonce",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_eventNonce",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_rewardAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "_rewardToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "_validators",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "_powers",
          type: "uint256[]",
        },
      ],
      name: "ValsetUpdatedEvent",
      type: "event",
    },
    {
      inputs: [
        { internalType: "string", name: "_cosmosDenom", type: "string" },
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "string", name: "_symbol", type: "string" },
        { internalType: "uint8", name: "_decimals", type: "uint8" },
      ],
      name: "deployERC20",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_erc20Address", type: "address" },
      ],
      name: "lastBatchNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "_invalidation_id", type: "bytes32" },
      ],
      name: "lastLogicCallNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_tokenContract", type: "address" },
        { internalType: "string", name: "_destination", type: "string" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "sendToCosmos",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "state_gravityId",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      name: "state_invalidationMapping",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "state_lastBatchNonces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "state_lastEventNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "state_lastValsetCheckpoint",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "state_lastValsetNonce",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
        { internalType: "uint256[]", name: "_amounts", type: "uint256[]" },
        { internalType: "address[]", name: "_destinations", type: "address[]" },
        { internalType: "uint256[]", name: "_fees", type: "uint256[]" },
        { internalType: "uint256", name: "_batchNonce", type: "uint256" },
        { internalType: "address", name: "_tokenContract", type: "address" },
        { internalType: "uint256", name: "_batchTimeout", type: "uint256" },
      ],
      name: "submitBatch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
        {
          components: [
            {
              internalType: "uint256[]",
              name: "transferAmounts",
              type: "uint256[]",
            },
            {
              internalType: "address[]",
              name: "transferTokenContracts",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "feeAmounts",
              type: "uint256[]",
            },
            {
              internalType: "address[]",
              name: "feeTokenContracts",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "logicContractAddress",
              type: "address",
            },
            { internalType: "bytes", name: "payload", type: "bytes" },
            { internalType: "uint256", name: "timeOut", type: "uint256" },
            {
              internalType: "bytes32",
              name: "invalidationId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "invalidationNonce",
              type: "uint256",
            },
          ],
          internalType: "struct LogicCallArgs",
          name: "_args",
          type: "tuple",
        },
      ],
      name: "submitLogicCall",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
        { internalType: "bytes32", name: "_theHash", type: "bytes32" },
        { internalType: "uint256", name: "_powerThreshold", type: "uint256" },
      ],
      name: "testCheckValidatorSignatures",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_valsetArgs",
          type: "tuple",
        },
        { internalType: "bytes32", name: "_gravityId", type: "bytes32" },
      ],
      name: "testMakeCheckpoint",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_newValset",
          type: "tuple",
        },
        {
          components: [
            {
              internalType: "address[]",
              name: "validators",
              type: "address[]",
            },
            { internalType: "uint256[]", name: "powers", type: "uint256[]" },
            { internalType: "uint256", name: "valsetNonce", type: "uint256" },
            { internalType: "uint256", name: "rewardAmount", type: "uint256" },
            { internalType: "address", name: "rewardToken", type: "address" },
          ],
          internalType: "struct ValsetArgs",
          name: "_currentValset",
          type: "tuple",
        },
        {
          components: [
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
          ],
          internalType: "struct Signature[]",
          name: "_sigs",
          type: "tuple[]",
        },
      ],
      name: "updateValset",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ]);
  const contract = new Contract(gravityAddress, cosmosInterface);

  const { state, send } = useContractFunction(contract, "sendToCosmos", {
    transactionName: "sending to cosmos",
  });
  return { state, send };
}

export default BridgePage;

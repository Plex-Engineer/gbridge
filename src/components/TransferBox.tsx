import { FilledButton, PrimaryButton, Text } from "cantoui";
import { useRef } from "react";
import styled from "styled-components";
import arrow from "assets/right.svg";
import CopyIcon from "assets/copy.svg";
import { toast } from "react-toastify";

interface Props {
  tokenSymbol: string;
  tokenIcon: string;
  networkName: string;
  onSwitch: () => void;
  onChange: (s: string) => void;
  disabled?: boolean;
  connected: boolean;
  button: React.ReactNode;
  max: string;
  amount?: string;
  from: {
    name: string;
    address?: string;
  };
  to: {
    name: string;
    address?: string;
  };
}
const TransferBox = (props: Props) => {
  const amountRef = useRef<HTMLInputElement>(null);
  function copyAddress(value: string | undefined) {
    navigator.clipboard.writeText(value ?? "");
    toast("copied address", {
      autoClose: 300,
    });
  }
  return (
    <TransferBoxStyled disabled={!props.connected}>
      <HighlightButton
        id="head-button"
        // disabled={props.connected}
        style={{
          width: "100%",
        }}
        onClick={props.onSwitch}
      >
        {!props.connected
          ? "Switch to " + props.networkName
          : "Connected to " + props.networkName}
      </HighlightButton>

      <div className="row">
        <Text type="text" color="white" align="left">
          {props.from.name}
        </Text>
        <img src={arrow} alt="right arrow" height={40} />
        <Text type="text" color="white" align="right">
          {props.to.name}
        </Text>
      </div>
      <div className="row">
        <Text type="text" color="white" align="left">
          {props.from.address
            ? props.from.address.slice(0, 4) +
              "..." +
              props.from.address.slice(-4)
            : "retrieving wallet"}
          <img
            src={CopyIcon}
            style={{
              height: "22px",
              position: "relative",
              top: "5px",
              left: "4px",
            }}
          />
        </Text>
        <Text
          type="text"
          color="white"
          align="right"
          onClick={() => copyAddress(props.from.address)}
        >
          {props.to.address
            ? props.to.address.slice(0, 4) + "..." + props.to.address.slice(-4)
            : "retrieving wallet"}{" "}
          <img
            src={CopyIcon}
            style={{
              height: "22px",
              marginLeft: "-6px",
              position: "relative",
              top: "5px",
            }}
          />
        </Text>
      </div>
      <div className="amount">
        <div className="token">
          <img src={props.tokenIcon} alt="eth" width={26} />
          <Text type="text" align="left" color="white">
            {props.tokenSymbol}
          </Text>
        </div>
        <div className="amount-input">
          <Text type="text" align="left" color="primary">
            amount :
          </Text>
          <input
            autoComplete="off"
            type="number"
            name="amount-bridge"
            id="amount-bridge"
            placeholder="0.00"
            // ref={amountRef}
            value={props.amount}
            onChange={(e) => props.onChange(e.target.value)}
          />
          <div
            className="max"
            style={{ cursor: "pointer" }}
            onClick={() => props.onChange(props.max)}
          >
            max: {props.max}
          </div>
        </div>
      </div>
      <div className="row">{props.button}</div>
      {/* <div
        style={{ cursor: "pointer" }}
        onClick={() => props.onChange(props.max)}
      >
        max: {props.max}
      </div> */}
    </TransferBoxStyled>
  );
};

interface StyeldProps {
  disabled?: boolean;
}
const TransferBoxStyled = styled.div<StyeldProps>`
  background-color: #242222;
  width: 560px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  padding-top: 3rem;
  border: 1px solid var(--primary-color);
  margin: 2rem 0;
  filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
  .row {
    display: flex;
    /* gap: 1rem; */
    justify-content: space-between;
    align-items: center;
    & > * {
      /* flex-grow: 1; */
      flex: 1;
      flex-basis: 0;
    }
  }
  position: relative;
  #head-button {
    position: absolute;
    top: -30px;
    width: 400px !important;
  }
  .max {
    position: absolute;
    right: 1.4rem;
    /* left: 1.4rem; */
    bottom: 4px;
    font-size: 14px;
  }
  .token {
    display: flex;
    gap: 1rem;
  }

  .amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 1.4rem;
    border: 1px solid var(--primary-color);
    background-color: #203128;

    .amount-input {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
  }

  input[type="number"] {
    background-color: transparent;
    border: none;
    outline: none;
    color: var(--primary-color);
    text-align: right;
    font-size: 22px;
    width: 100px;
    border-bottom: 1px solid transparent;
    &::placeholder {
      color: var(--primary-darker-color);
    }
    &:focus,
    &:hover {
      border-bottom: 1px solid var(--primary-color);
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
`;

export const HighlightButton = styled(FilledButton)`
  background-color: #172b23;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 1rem !important;

  &:hover {
    background-color: #203128;
    color: var(--primary-dark-color);
    border: 1px solid var(--primary-darker-color);
  }

  &:disabled {
    background-color: #373737;
    color: var(--off-white-color);
    border: 1px solid var(--off-white-color);
  }
`;
export default TransferBox;

import { FilledButton, PrimaryButton, Text } from "cantoui";
import { useRef } from "react";
import styled from "styled-components";

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
}
const TransferBox = (props: Props) => {
  const amountRef = useRef<HTMLInputElement>(null);
  return (
    <TransferBoxStyled>
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
        </div>
      </div>
      <div className="row">
        <PrimaryButton
          disabled={props.connected}
          style={{
            width: "100%",
          }}
          onClick={props.onSwitch}
        >
          {!props.connected
            ? "Switch to " + props.networkName
            : "Connected to " + props.networkName}
        </PrimaryButton>
        {props.button}
      </div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => props.onChange(props.max)}
      >
        max: {props.max}
      </div>
    </TransferBoxStyled>
  );
};

const TransferBoxStyled = styled.div`
  background-color: #242222;
  width: 560px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  .row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .token {
    display: flex;
    gap: 1rem;
  }

  .amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
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
    width: 200px;
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
export default TransferBox;

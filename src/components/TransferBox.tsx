import { FilledButton, PrimaryButton, Text } from "cantoui";
import styled from "styled-components";

interface Props {
  tokenSymbol: string;
  tokenIcon: string;
  networkName: string;
  onBridge: () => void;
  onSwitch: () => void;
  disabled?: boolean;
}
const TransferBox = (props: Props) => {
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
            type="text"
            name="amount-bridge"
            id="amount-bridge"
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="row">
        <PrimaryButton
          style={{
            width: "100%",
          }}
        >
          Switch to {props.networkName}
        </PrimaryButton>
        <PrimaryButton>Bridge</PrimaryButton>
      </div>
    </TransferBoxStyled>
  );
};

const TransferBoxStyled = styled.div`
  background-color: #242222;
  width: 500px;
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

  input[type="text"] {
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
  }
`;
export default TransferBox;

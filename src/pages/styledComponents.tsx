import styled from "@emotion/styled";

export const Container = styled.div`
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

  .loading {
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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
export const Balance = styled.div`
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

export const Button = styled.button`
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
  justify-content: center;
  width: 22rem;
  text-align: center;
  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

export const DisabledButton = styled(Button)`
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

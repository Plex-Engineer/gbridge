import { useState } from "react";
import styled from "@emotion/styled";
import { enterUser } from "./utils/button";
import { useNetworkInfo } from "stores/networkInfo";

const Container = styled.div`
  align-self: center;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .textField {
    margin: auto;
    margin-top: 25px;
    padding: 0.4rem 0;
    display: flex;
    width: 50rem;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    padding: 1rem 2rem;
    background-color: #1e2c1d;
    border: 1px solid var(--primary-color);
    text-shadow: none;
  }

  input[type="text"] {
    background-color: transparent;
    width: 100%;
    border: none;
    font-size: 18px;
    font-weight: 500;
    color: white;
    margin: 0 auto;
    /* margin-top : 4rem; */

    &:focus {
      outline: none;
    }
  }

  .coin {
    border: 2px solid var(--primary-color);
    width: 70rem;
    margin: 0 auto;
    margin-top: 4rem;
    min-height: calc(100vh - 38rem);

    display: flex;
    align-items: center;
    color: #fff;
  }
  .coin > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    p {
      text-align: center;
    }
  }

  .title {
    text-shadow: none;
    color: white;
    text-align: center;
    margin-top: 4rem;
    font-size: 28px;
    margin-bottom: 0px;
  }
  .subtitle {
    text-shadow: none;
    color: white;
    text-align: center;
    font-size: 18px;
  }
`;

const Button = styled.button`
  font-weight: 300;
  font-size: 18px;
  background-color: black;
  color: var(--primary-color);
  padding: 0.2rem 2rem;
  border: 1px solid var(--primary-color);
  /* margin: 3rem auto; */
  align-self: center;
  display: flex;
  justify-content: center;
  margin-top: 40px;

  &:hover {
    background-color: var(--primary-color-dark);
    color: black;
    cursor: pointer;
  }
`;

const GeneratePubKey = () => {
  const [isSuccess, setIsSuccess] = useState("");
  const { account, chainId } = useNetworkInfo();
  return (
    <Container>
      <p className="title">create a public key for your canto account </p>
      <p className="subtitle">
        learn more about canto public keys{" "}
        <a
          style={{ color: "white" }}
          href="https://canto.gitbook.io/canto/user-guides/bridging-assets-to-canto"
        >
          here
        </a>
      </p>
      {isSuccess.length != 0 ? <p className="textField">{isSuccess}</p> : null}
      <Button onClick={() => 
      enterUser(account, setIsSuccess)
      }>
        generate public key
      </Button>
    </Container>
  );
};

export default GeneratePubKey;
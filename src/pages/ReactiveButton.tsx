import { useEffect } from "react";
import { useTokenStore } from "stores/tokens";
import loading from "assets/loading.svg";
import { PrimaryButton } from "cantoui";

interface RBProps {
  amount: string;
  account: string | undefined;
  token: any | undefined;
  destination: string | undefined;
  gravityAddress: string | undefined;
  hasPubKey: boolean;
  onClick: () => void;
  disabled: boolean;
}
export const ReactiveButton = ({
  amount,
  token,
  hasPubKey,
  onClick,
  disabled,
}: RBProps) => {
  if (token == undefined) {
    return <PrimaryButton>Loading</PrimaryButton>;
  }

  const [approveStatus, cosmosStatus] = useTokenStore((state) => [
    state.approveStatus,
    state.cosmosStatus,
  ]);

  useEffect(() => {
    if (approveStatus == "Success") {
      setTimeout(() => {
        // resetApprove();
      }, 1000);
    }
  }, [approveStatus]);

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
  //if the account doesn't have a public key
  if (!hasPubKey) {
    return <PrimaryButton disabled>please generate public key</PrimaryButton>;
  }
  //if the token hasn't been approved
  if (token?.allowance == -1) {
    return <PrimaryButton disabled>select a token</PrimaryButton>;
  }
  //if the amount enter is greater than balance available in the wallet && the token has been approved
  if (Number(amount) > Number(token.balanceOf) && token.allowance != 0) {
    return <PrimaryButton disabled>insufficient funds</PrimaryButton>;
  }

  //if amount entered is greater than allowance approved for the token
  if (Number(amount) <= 0 && token.allowance != 0) {
    return <PrimaryButton disabled>enter amount</PrimaryButton>;
  }
  if (disabled) {
    return <PrimaryButton disabled>enter gravity address</PrimaryButton>;
  }

  return (
    <PrimaryButton onClick={onClick}>
      {Number(amount) > token.allowance && token.allowance != 0
        ? getStatus("increase allowance", approveStatus)
        : token.allowance == 0
        ? getStatus("approve", approveStatus)
        : getStatus("send token", cosmosStatus)}
      {approveStatus == "Mining" || cosmosStatus == "Mining" ? (
        <img
          style={{
            marginLeft: "20px",
          }}
          className="loading"
          height={26}
          src={loading}
        />
      ) : null}
    </PrimaryButton>
  );
};

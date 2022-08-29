export function checkBridgeAmountConfirmation(amount: number, max: number) {
    if (amount <= 0 || !amount) {
      return "enter amount";
    } else {
      if (amount > max) {
        return "insufficient funds";
      }
    }
    return "bridge out";
  }

  export function checkGravityAddress(address: string) {
    if (address.slice(0, 7) != "gravity" || address.length != 46) {
      return false;
    }
    return true;
  }
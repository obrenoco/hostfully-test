export const convertNumberToDollar = (num: number) => {
  if (num) {
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
};

export const convertNumberToDollar = (num: number) =>
  num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export const generateRandomNumberId = () => {
  return Math.floor(10 ** 9 + Math.random() * (10 ** 10 - 1 - 10 ** 9));
};

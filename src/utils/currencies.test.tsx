import { formatNumberToDollar } from "./currencies";

describe("formatNumberToDollar", () => {
  test("formats a positive number to dollar", () => {
    const result = formatNumberToDollar(1234.56);
    expect(result).toBe("$1,234.56");
  });

  test("formats a negative number to dollar", () => {
    const result = formatNumberToDollar(-7890.12);
    expect(result).toBe("-$7,890.12");
  });

  test("formats zero to dollar", () => {
    const result = formatNumberToDollar(0);
    expect(result).toBe("$0.00");
  });
});

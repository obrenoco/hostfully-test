import { generateRandomNumberId } from "./numbers";

describe("generateRandomNumberId", () => {
  it("should generate a random number within the specified range", () => {
    const randomId = generateRandomNumberId();
    expect(typeof randomId).toBe("number");
    expect(randomId.toString().length).toBe(10);
  });

  it("should generate unique IDs on successive calls", () => {
    const id1 = generateRandomNumberId();
    const id2 = generateRandomNumberId();
    expect(id1).not.toBe(id2);
  });
});

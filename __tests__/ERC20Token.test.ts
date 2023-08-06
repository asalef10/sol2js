 const MyERC20Token = require("../ERC20Standards/ERC20Token"); 

describe("ERC20Token", () => {
  let token: any;

  beforeEach(() => {
    token = new MyERC20Token("MyToken", "MTK", 18, 1000000);
  });

  test("should have correct total supply", () => {
    expect(token.getTotalSupply()).toBe(1000000);
  });

  test("should return correct balance for sender", () => {
    expect(token.balanceOf("sender")).toBe(1000000);
  });

  test("should return undefined allowance initially", () => {
    expect(token.allowance("owner", "spender")).toBeUndefined();
  });

  test("should set allowance correctly", () => {
    token.approve("owner", "spender", 1000);
    expect(token.allowance("owner", "spender")).toBe(1000);
  });

  test("should transfer tokens successfully", () => {
    token.transfer("sender", "recipient", 500);
    expect(token.balanceOf("sender")).toBe(999500);
    expect(token.balanceOf("recipient")).toBe(500);
  });

  test("should transferFrom tokens successfully", () => {
    token.approve("owner", "spender", 1000);
    token.transferFrom("owner", "spender", "recipient", 200);
    expect(token.balanceOf("owner")).toBe(999800);
    expect(token.balanceOf("recipient")).toBe(200);
    expect(token.allowance("owner", "spender")).toBe(800);
  });

  test("should throw error for insufficient balance in transfer", () => {
    expect(() => token.transfer("sender", "recipient", 1000001)).toThrowError(
      "Insufficient balance"
    );
  });

  test("should throw error for insufficient balance in transferFrom", () => {
    expect(() =>
      token.transferFrom("owner", "spender", "recipient", 1000001)
    ).toThrowError("Insufficient balance");
  });

  test("should throw error for insufficient allowance in transferFrom", () => {
    token.approve("owner", "spender", 1000);
    expect(() =>
      token.transferFrom("owner", "spender", "recipient", 2000)
    ).toThrowError("Insufficient allowance");
  });
});

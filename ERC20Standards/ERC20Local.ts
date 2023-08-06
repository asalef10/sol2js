class ERC20Local {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply_amount: number;
  
    balances: Map<string, number>;
    allowed: Map<string, Map<string, number>>;
  
    constructor(
      name: string,
      symbol: string,
      decimals: number,
      totalSupply_amount: number
    ) {
      this.name = name;
      this.symbol = symbol;
      this.decimals = decimals;
      this.totalSupply_amount = totalSupply_amount;
  
      this.balances = new Map<string, number>();
      this.allowed = new Map<string, Map<string, number>>();
  
      this.balances.set("sender", totalSupply_amount);
    }
  
    mint(account: string, amount: number) {
      const accountBalance = this.balances.get(account) || 0;
      this.balances.set(account, accountBalance + amount);
      this.totalSupply_amount += amount;
      return true;
    }
  
    totalSupply(): number {
      return this.totalSupply_amount;
    }
  
    balanceOf(who: string): number | undefined {
      return this.balances.get(who);
    }
  
    allowance(owner: string, spender: string): number | undefined {
      return this.allowed.get(owner)?.get(spender);
    }
  
    approve(owner: string, spender: string, amount: number): boolean {
      const ownerAllowances =
        this.allowed.get(owner) || new Map<string, number>();
      ownerAllowances.set(spender, amount);
      this.allowed.set(owner, ownerAllowances);
      return true;
    }
    transfer(from: string, to: string, amount: number): boolean {
      const senderBalance = this.balances.get(from) || 0;
      if (senderBalance < amount) {
        throw new Error("Insufficient balance");
      }
  
      this.balances.set(from, senderBalance - amount);
      this.balances.set(to, (this.balances.get(to) || 0) + amount);
      return true;
    }
  
    transferFrom(
      owner: string,
      spender: string,
      to: string,
      amount: number
    ): boolean {
      const fromBalance = this.balances.get(owner) || 0;
      if (fromBalance < amount) {
        throw new Error("Insufficient balance");
      }
  
      const spenderAllowance = this.allowed.get(owner)?.get(spender) || 0;
      if (spenderAllowance < amount) {
        throw new Error("Insufficient allowance");
      }
  
      this.balances.set(owner, fromBalance - amount);
      this.balances.set(to, (this.balances.get(to) || 0) + amount);
      this.allowed.get(owner)?.set(spender, spenderAllowance - amount);
      return true;
    }
  }
  module.exports = ERC20Local;
  
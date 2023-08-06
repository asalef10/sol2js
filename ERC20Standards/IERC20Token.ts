export interface IERC20Token {
    mint(account: string, amount: number): Promise<boolean>;
    totalSupply(): Promise<any>;
    balanceOf(address: string|object): Promise<string>;
    allowance(tokenOwner: string, spender: string): Promise<number>;
    transfer(to: string, tokens: number): Promise<boolean>;
    approve(spender: string, tokens: number): Promise<boolean>;
    transferFrom(from: string, to: string, tokens: number): Promise<boolean>;
    getDefaultAccount(): Promise<string>;
}

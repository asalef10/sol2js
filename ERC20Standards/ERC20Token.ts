const Web3 = require("web3");
const erc20ABI = require("../artifacts/ERC20_ABI");
const HDWalletProvider = require("@truffle/hdwallet-provider");
class ERC20Token {
  gasLimit = 5000000;

  private web3: typeof Web3;
  private contract: object | any;

  constructor(providerUrl: string, contractAddress: string) {
    try {
      const provider = new HDWalletProvider(
        process.env.WALLET_KEY,
        providerUrl
      );
      this.web3 = new Web3(provider);
      this.contract = new this.web3.eth.Contract(erc20ABI, contractAddress);
    } catch (err) {
      console.log(err + ' Private key wallet provider is required');
    }
  }

  async getName(): Promise<string> {
    return await this.contract.methods.name().call();
  }

  async getSymbol(): Promise<string> {
    return await this.contract.methods.symbol().call();
  }

  async getDecimals(): Promise<number> {
    return await this.contract.methods.decimals().call();
  }

  async totalSupply(): Promise<any> {
    return this.contract.methods.totalSupply().call();
  }

  async balanceOf(address: string | object): Promise<string> {
    return await this.contract.methods.balanceOf(address).call();
  }

  async allowance(owner: string, spender: string): Promise<string> {
    return await this.contract.methods.allowance(owner, spender).call();
  }

  async transfer(to: string, value: string, from?: string): Promise<object> {
    const account = from || (await this.getDefaultAccount());
    const estimatedGas = this.contract.methods
      .transfer(to, value)
      .estimateGas({ from: account });

    const transfer = this.contract.methods
      .transfer(to, value)
      .send({ from: account, gas: estimatedGas, gasLimit: this.gasLimit });

    return transfer;
  }

  async approve(
    spender: string,
    value: string,
    from?: string
  ): Promise<object> {
    const account = from || (await this.getDefaultAccount());
    const estimatedGas = await this.contract.methods
      .approve(spender, value)
      .estimateGas({ from: account });

    const approve = await this.contract.methods
      .approve(spender, value)
      .send({ from: account, gas: estimatedGas });

    return approve;
  }

  async transferFrom(
    from: string,
    to: string,
    value: string,
    spender?: string
  ): Promise<object> {
    const account = spender || (await this.getDefaultAccount());
    const estimatedGas = await this.contract.methods
      .transferFrom(from, to, value)
      .estimateGas({ from: account });

    const transferFrom = await this.contract.methods
      .transferFrom(from, to, value)
      .send({ from: account, gas: estimatedGas });

    return transferFrom;
  }

  async getDefaultAccount(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }
}
module.exports = ERC20Token;

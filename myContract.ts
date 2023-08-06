import { IERC20Token } from "./ERC20Standards/IERC20Token";
const ERC20Token_class = require("./ERC20Standards/ERC20Token");
import config from "./myconfig.json";
class MyContract {
  erc20Token: IERC20Token;
  num: number = 700;
  owner: string = "asi";
  constructor() {
    this.erc20Token = new ERC20Token_class(
      config.provider,
      config.contract_address,
    );
  }
  getBalanceOwner() {
    let balance = this.erc20Token.balanceOf(this.erc20Token.getDefaultAccount);
    return balance;
  }
  getTotalSupply() {
    let result = this.erc20Token.totalSupply();
    return result;
  }
  calculationAge() {
    let ageNumber = this.printNumber();
    let result = this.mulDiv(ageNumber, 10, 2);
    return result;
  }
  getAddress() {
    return this.erc20Token.getDefaultAccount();
  }
  mulDiv(a: number, b: number, denominator: number) {
    let mul = a * b;
    let div = mul / denominator;
    return div;
  }
  printNumber() {
    return 23;
  }
  multiplyNumbers(x: number, y: number) {
    return x * y;
  }
  printVariable() {
    return this.owner;
  }
  printString() {
    return "Hello";
  }
  isReady() {
    return true;
  }
}
module.exports = MyContract;

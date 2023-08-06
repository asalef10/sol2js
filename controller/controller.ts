import { Request, Response } from "express";
const router = require("express").Router();
const Sol2AstConverterClass = require("../services/sol2ast/sol2astConverter");
const translateAST = require("../services/translateAST");
const fs = require("fs");

router.get("/", async (req: Request, res: Response) => {
  const MyContract = require("../myContract");
  const contract_class: typeof MyContract = new MyContract();
  const resultTotalSupply = await contract_class.getTotalSupply();
  const resultBalance = await contract_class.getTotalSupply();
  const resultAddress = await contract_class.getAddress();
  res.json({ 
    ERC20_Result: {
      TotalSupply: resultTotalSupply,
      balance: resultBalance,
      addressOwner: resultAddress, 
    }, 
  });
});

router.get("/ast", async (req: Request, res: Response) => {
  const solidityCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MyContract is ERC20 {
    uint256 num = 700;
    string private owner = "asi";
    constructor() ERC20("MyToken", "MTK") {
        mint(msg.sender, 1000000 * 10**decimals());
    }
    function getBalanceOwner() public view returns (uint256) {
        uint256 balance = balanceOf(msg.sender);
        return balance;
    }
    function getTotalSupply() public view returns (uint256) {
        uint256 result = totalSupply();
        return result;
    }
    function calculationAge() public view returns (uint256) {
        uint256 ageNumber = printNumber();
        uint256 result = mulDiv(ageNumber, 10, 2);
        return result;
    }
    function getAddress() public pure returns (address) {
        return msg.sender;
    }
    function mulDiv(
        uint256 a,
        uint256 b,
        uint256 denominator
    ) public pure returns (uint256) {
        uint256 mul = a * b;
        uint256 div = mul / denominator;
        return div;
    }
    function printNumber() public pure returns (uint256) {
        return 23;
    }
   
    function multiplyNumbers(uint256 x, uint256 y)
        public
        pure
        returns (uint256)
    {
        return x * y;
    }

    function printVariable() public view returns (string memory) {
        return owner;
    }

    function printString() public pure returns (string memory) {
        return "Hello";
    }

    function isReady() public pure returns (bool) {
        return true;
    }

 
}
`;
  let ast = Sol2AstConverterClass.solidityToAst(solidityCode);
  let tsResult = await translateAST.translateAST(ast);
  fs.writeFileSync("myContract.ts", tsResult);

  res.json(tsResult);
});
module.exports = router;

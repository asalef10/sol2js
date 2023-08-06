import { AST, ASTNode } from "../../interface/ast.interface";
const prettier = require("prettier");
const AstNodeHandlers = require("./astNodeHandlers");
class AstToTs {
  astNodeHandlers: typeof AstNodeHandlers;

  constructor() {
    this.astNodeHandlers = new AstNodeHandlers();
  }
  async convertAstToTs(ast: AST): Promise<string> {
    try {
      const contract = this.findContract(ast);

      if (!contract) {
        throw new Error("ContractDefinition not found in the AST.");
      }
      const isERC20Contract = this.checkInheritanceERC20(contract);

      let tsCode = isERC20Contract
      ? 'import { IERC20Token } from "./ERC20Standards/IERC20Token";\const ERC20Token_class = require("./ERC20Standards/ERC20Token");\nimport config from "./myconfig.json";\n'
      : '';
      tsCode += `class ${contract.name} {\n`;

      if (isERC20Contract) {
        tsCode += `erc20Token: IERC20Token;\n`;
      }

      for (let node of contract.subNodes) {
        if (node.type === "StateVariableDeclaration") {
          tsCode += this.parseStateVariableDeclaration(node);
        } else if (
          node.type === "FunctionDefinition" &&
          node.body.statements.length > 0
        ) {
          tsCode += this.parseFunctionDefinition(node, isERC20Contract);
        }
      }
      tsCode += `} module.exports =${contract.name} \n`;
      return await prettier.format(tsCode, { parser: "typescript" });
    } catch (error) {
      console.error("An error occurred while translating AST:", error);
      throw error;
    }
  }
  checkERC20ContractImport(ast: AST): boolean {
    for (let node of ast.children) {
      if (
        node.type === "ImportDirective" &&
        node.path === "@openzeppelin/contracts/token/ERC20/ERC20.sol"
      ) {
        return true;
      }
    }
    return false;
  }
  checkInheritanceERC20(contract: ASTNode): boolean {
    return contract.baseContracts.some(
      (base: any) => base.baseName.namePath === "ERC20"
    );
  }
  findContract(ast: AST): ASTNode | undefined {
    return ast.children.find(
      (child: ASTNode) => child.type === "ContractDefinition"
    );
  }
  parseStateVariableDeclaration(node: ASTNode): string {
    const variable = node.variables[0];
    const { name, typeName, expression } = variable;

    if (typeName.name === "address") {
      return ` ${name}: string = "${expression.number}";\n`;
    } else if (typeName.name === "bool") {
      return ` ${name}: boolean = ${expression.value};\n`;
    } else {
      const tsType = this.astNodeHandlers.mapSolidityTypeToTs(typeName.name);
      const defaultValue = expression.number || `"${expression.value}"`;

      return ` ${name}: ${tsType} = ${defaultValue};\n`;
    }
  }
  parseFunctionDefinition(node: ASTNode, isERC20Contract: boolean): string {
    const functionName = node.isConstructor ? "constructor" : node.name;
    const params = node.parameters
      .map(
        (param: ASTNode) =>
          `${param.name}: ${this.astNodeHandlers.mapSolidityTypeToTs(
            param.typeName.name
          )}`
      )
      .join(", ");
    let tsCode = ` ${functionName}(${params}) {\n`;
    if (node.isConstructor && isERC20Contract) {
      tsCode += `this.erc20Token = new ERC20Token_class(config.provider,config.contract_address);\n`;
    }
    tsCode += this.astNodeHandlers.getFunctionBody(node);
    tsCode += ` }\n`;

    return tsCode;
  } 
}
module.exports = AstToTs;
 
const parser = require("solidity-parser-antlr");

class Sol2AstConverter {
  solidityToAst(solidityCode: string): string {
    try {
      const ast = parser.parse(solidityCode);
      return ast;
    } catch (error) {
      console.error("An error occurred while translating AST:", error);
      throw error;
    }
  }
}

module.exports = new Sol2AstConverter();

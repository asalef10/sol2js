import { AST } from "../interface/ast.interface";
const AstNodeHandlers = require("./astTranslation/astNodeHandlers");
const AstToTs = require("./astTranslation/astToTs");
class TranslateAst {
  astNodeHandlers;
  astToTs: any;
  constructor() {
    this.astNodeHandlers = new AstNodeHandlers();
    this.astToTs = new AstToTs();
  }

  async translateAST(ast: AST): Promise<string> {
    try {
      let formattedCode = this.astToTs.convertAstToTs(ast);
      return formattedCode;
    } catch (error) {
      console.error("An error occurred while translating AST:", error);
      throw error;
    }
  }
}

module.exports = new TranslateAst();
import { ASTNode } from "../../interface/ast.interface";

class AstNodeHandlers {
  classVariables: string[] = [];

  checkERC20Functions(functionName: string): string {
    const erc20Functions = [
      "mint",
      "totalSupply",
      "balanceOf",
      "allowance",
      "transfer",
      "approve",
      "transferFrom",
    ];
    if (erc20Functions.includes(functionName)) {
      return `erc20Token.${functionName}`;
    } else {
      return functionName;
    }
  }
  mapSolidityTypeToTs(solidityType: string): string {
    switch (solidityType) {
      case "uint256":
      case "uint8":
      case "uint":
      case "int":
        return "number";
      case "string":
      case "address":
        return "string";
      case "bool":
        return "boolean";
      default:
        return "unknown";
    }
  }
  getFunctionBody(node: ASTNode): string {
    let body = "";
    for (let stmt of node.body.statements) {
      if (stmt.type === "VariableDeclarationStatement") {
        body += this.getVariableDeclarationStatement(stmt);
      } else if (stmt.type === "ReturnStatement") {
        if (stmt.expression.type === "MemberAccess") {
          body += ` return ${this.getMemberAccess(stmt.expression)};\n`;
        } else {
          body += this.getReturnStatement(stmt);
        }
      } else if (stmt.type === "ExpressionStatement") {
        if (stmt.expression.type === "Assignment") {
          let left = stmt.expression.left.name;
          let right = this.getFunctionCall(stmt.expression.right);
          body += `let ${left} = ${right};\n`;
        }
      }
    }
    return body;
  }
  getMemberAccess(expr: ASTNode): string {
    if (expr.expression.name === "msg" && expr.memberName === "sender") {
      return `this.erc20Token.getDefaultAccount()`;
    }
    return "";
  }
  getFunctionCall(expr: ASTNode): string {
    try {
      if (expr?.arguments) {
        let functionName = this.checkERC20Functions(expr.expression.name);

        let args = expr?.arguments
          .map(
            (arg: ASTNode) =>
              arg.number || arg.name || this.getFunctionCall(arg)
          )
          .join(", ");

        return `this.${functionName}(${args})`;
      } else if (expr.type === "MemberAccess") {
        if (expr.expression.name === "msg" && expr.memberName === "sender") {
           return `this.erc20Token.getDefaultAccount`;
        }
        return "";
      }
      return "";
    } catch (error) {
      console.error("An error occurred while processing function call:", error);
      throw error;
    }
  }
  getVariableDeclarationStatement(stmt: ASTNode): string {
    try {
      let name = stmt.variables[0].name;
      let expr = stmt.initialValue;
      this.classVariables.push(name);

      if (expr.type === "BinaryOperation") {
        let left = expr.left.name || expr.left.number;
        let right = expr.right.name || expr.right.number;
        return ` let ${name} = ${left} ${expr.operator} ${right};\n`;
      } else if (expr.type === "FunctionCall") {
        let call = this.getFunctionCall(expr);
        return ` let ${name} = ${call};\n`;
      } else if (expr.type === "Identifier") {
        return ` let ${name} = ${expr.name};\n`;
      } else if (expr.type === "NumberLiteral") {
        console.log("expr");

        return ` let ${name} = ${expr.number};\n`;
      } else if (expr.type === "StringLiteral") {
        return ` let ${name} = "${expr.value}";\n`;
      } else if (expr.type === "HexLiteral") {
        return `let ${name} = "${expr.value}";\n`;
      } else {
        return "";
      }
    } catch (error) {
      console.error(
        "An error occurred while processing variable declaration statement:",
        error
      );
      throw error;
    }
  }
  getReturnStatement(stmt: ASTNode): string {
    try {
      if (stmt.expression.type === "BinaryOperation") {
        return this.getBinaryOperationReturnStatement(stmt.expression);
      } else if (stmt.expression.type === "StringLiteral") {
        return this.getStringLiteralReturnStatement(stmt.expression);
      } else if (stmt.expression.type === "BooleanLiteral") {
        return this.getBooleanLiteralReturnStatement(stmt.expression);
      } else if (stmt.expression.type === "Identifier") {
        return this.getVariableReferenceReturnStatement(stmt.expression);
      } else if (stmt.expression.type === "NumberLiteral") {
        return this.getNumberLiteralReturnStatement(stmt.expression);
      }

      return "";
    } catch (error) {
      console.error(
        "An error occurred while processing return statement:",
        error
      );
      throw error;
    }
  }
  getBinaryOperationReturnStatement(expr: ASTNode): string {
    let left = expr.left.number || expr.left.name;
    let right = expr.right.number || expr.right.name;
    return ` return ${left} ${expr.operator} ${right} ;\n`;
  }
  getStringLiteralReturnStatement(expr: ASTNode): string {
    return `return "${expr.value}";\n`;
  }
  getBooleanLiteralReturnStatement(expr: ASTNode): string {
    return `return  ${expr.value};\n`;
  }
  getVariableReferenceReturnStatement(expr: ASTNode): string {
    if (!this.classVariables.includes(expr.name)) {
      return `return this.${expr.name};\n`;
    } else {
      return `return ${expr.name};\n`;
    }
  }
  getNumberLiteralReturnStatement(expr: ASTNode): string {
    return `return ${expr.number};\n`;
  }
}

module.exports = AstNodeHandlers;
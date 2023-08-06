// ast.ts
export interface AST {
  type: string;
  children: ASTNode[];
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}

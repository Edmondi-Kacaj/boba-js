import { Token } from '../../token/';
import { Expression } from '../../ast/';

export default class PrefixExpression implements Expression {
  public right?: Expression;
  constructor(public token: Token, public operator: string) {}

  expressionNode() {}
  tokenLiteral() {
    return this.token.literal;
  }
  toString() {
    return `(${this.operator}${this.right?.toString()})`;
  }
}
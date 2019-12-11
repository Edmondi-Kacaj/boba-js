import hasOwnProperty from './utils/has-own-property';

export const enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',

  // Identifiers + Literals
  IDENT = 'IDENT',
  INT = 'INT',

  // Operators
  ASSIGN = '=',
  PLUS = '+',
  MINUS = '-',
  BANG = '!',
  ASTERISK = '*',
  SLASH = '/',

  LT = '<',
  GT = '>',

  // Delimiters
  COMMA = ',',
  SEMICOLON = ';',

  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',

  // Keywords
  FUNCTION = 'FUNCTION',
  LET = 'LET',
}

export type LiteralType = string | 0;

export type Token = {
  type: TokenType;
  literal: LiteralType;
};

const KEYWORDS = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
};

export default function createToken(
  type: TokenType,
  literal: LiteralType
): Token {
  return { type, literal };
}

export function lookupIdentifier(ident: string) {
  if (hasOwnProperty(KEYWORDS, ident)) {
    return KEYWORDS[ident];
  }
  return TokenType.IDENT;
}

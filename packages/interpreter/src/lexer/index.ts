import createToken, { Token, TokenType, lookupIdentifier } from '../token';

type ToStringable = {
  toString(): string;
};
type Char = string | 0;

const lettersRegex = /[A-Za-z_]/;
const whitespaceRegex = /\s/;
const digitsRegex = /\d/;
function isLetter<T extends ToStringable>(ch: T) {
  return lettersRegex.test(ch.toString()) === true;
}
function isWhitespace<T extends ToStringable>(ch: T) {
  return whitespaceRegex.test(ch.toString()) === true;
}
function isDigit<T extends number | string>(ch: T) {
  // JavaScript will coerce the `0` number into a string, and the regex test
  // will be true even when it really should be false
  if (ch === 0) {
    return false;
  }
  return digitsRegex.test(ch.toString()) === true;
}

export default class Lexer {
  private position = 0; // current position in input (points to current char)
  private readPosition = 0; // current reading position in input (after current char)
  private ch: Char = ''; // current char under examination

  constructor(public input: string) {
    this.readChar();
  }

  *[Symbol.iterator]() {
    while (this.readPosition < this.input.length) {
      yield this.nextToken();
    }
  }

  private peekChar(): Char {
    if (this.readPosition >= this.input.length) {
      return 0;
    }
    return this.input[this.readPosition];
  }

  private readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = 0;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private readIdentifier(): string {
    const position = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private readNumber(): string {
    const position = this.position;
    while (isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private readString(): string {
    const position = this.position + 1;
    this.readChar();
    while (this.ch !== '"') {
      if (this.ch === 0) {
        break;
      }
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  private skipWhitespace(): void {
    while (isWhitespace(this.ch)) {
      this.readChar();
    }
  }

  public nextToken(): Token {
    let token: Token;
    this.skipWhitespace();
    switch (this.ch) {
      case TokenType.ASSIGN:
        if (this.peekChar() === TokenType.ASSIGN) {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = createToken(TokenType.EQ, literal);
          break;
        }
        token = createToken(TokenType.ASSIGN, this.ch);
        break;
      case TokenType.PLUS:
        token = createToken(TokenType.PLUS, this.ch);
        break;
      case TokenType.MINUS:
        token = createToken(TokenType.MINUS, this.ch);
        break;
      case TokenType.BANG:
        if (this.peekChar() === '=') {
          const ch = this.ch;
          this.readChar();
          const literal = ch + this.ch;
          token = createToken(TokenType.NOT_EQ, literal);
          break;
        }
        token = createToken(TokenType.BANG, this.ch);
        break;
      case TokenType.SLASH:
        token = createToken(TokenType.SLASH, this.ch);
        break;
      case TokenType.ASTERISK:
        token = createToken(TokenType.ASTERISK, this.ch);
        break;
      case TokenType.LT:
        token = createToken(TokenType.LT, this.ch);
        break;
      case TokenType.GT:
        token = createToken(TokenType.GT, this.ch);
        break;
      case TokenType.COMMA:
        token = createToken(TokenType.COMMA, this.ch);
        break;
      case TokenType.SEMICOLON:
        token = createToken(TokenType.SEMICOLON, this.ch);
        break;
      case TokenType.LPAREN:
        token = createToken(TokenType.LPAREN, this.ch);
        break;
      case TokenType.RPAREN:
        token = createToken(TokenType.RPAREN, this.ch);
        break;
      case TokenType.LBRACE:
        token = createToken(TokenType.LBRACE, this.ch);
        break;
      case TokenType.RBRACE:
        token = createToken(TokenType.RBRACE, this.ch);
        break;
      case TokenType.LBRACKET:
        token = createToken(TokenType.LBRACKET, this.ch);
        break;
      case TokenType.RBRACKET:
        token = createToken(TokenType.RBRACKET, this.ch);
        break;
      case '"':
        token = createToken(TokenType.STRING, this.readString());
        break;
      case TokenType.COLON:
        token = createToken(TokenType.COLON, this.ch);
        break;
      case 0:
        token = createToken(TokenType.EOF, '');
        break;
      default:
        if (isLetter(this.ch)) {
          const literal = this.readIdentifier();
          return createToken(lookupIdentifier(literal), literal);
        } else if (isDigit(this.ch)) {
          return createToken(TokenType.INT, this.readNumber());
        } else {
          token = createToken(TokenType.ILLEGAL, this.ch);
          break;
        }
    }
    this.readChar();
    return token;
  }
}

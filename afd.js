import { keywords } from "./keywords.js";
import { tokens } from "./tokens.js";
import { finalStates } from "./finalStates.js";

export class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = { ...tokens };
    this.currentState = "";
  }

  isAlpha(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
  }

  isNumber(ch) {
    return ch >= "0" && ch <= "9";
  }

  isSpecialCharacter(ch) {
    return !this.isAlpha(ch) && !this.isNumber(ch);
  }

  isWhiteSpace(ch) {
    return ch === " " || ch === "\t" || ch === "\n";
  }

  isKeyword(token) {
    return keywords.includes(token);
  }

  isFinalState(state) {
    return finalStates.includes(state);
  }

  analyzeToken(token, finalState) {
    if (token.trim() === "") return;

    if (this.isFinalState(finalState)) {
      switch (finalState) {
        case "IDENTIFIER":
          if (this.isKeyword(token)) {
            this.incrementInput(this.tokens, "keywords");
          } else {
            this.incrementInput(this.tokens, "identifiers");
          }
          break;
        case "INTEGER":
          this.incrementInput(this.tokens, "integers");
          break;
        case "DECIMAL":
          this.incrementInput(this.tokens, "decimalNumbers");
          break;
        case "STRING":
          this.incrementInput(this.tokens, "string");
          break;
        case "DECREMENT":
          this.incrementInput(this.tokens, "decrement");
          break;
        case "INCREMENT":
          this.incrementInput(this.tokens, "increment");
          break;
        case "MULTILINE_COMMENT":
          this.incrementInput(this.tokens, "comment");
          break;
        case "LINE_COMMENT":
          this.incrementInput(this.tokens, "lineComment");
          break;

        case "ARITHMETIC_OPERATOR_PLUS":
        case "ARITHMETIC_OPERATOR_MUL":
        case "ARITHMETIC_OPERATOR_MINUS":
        case "ARITHMETIC_OPERATOR_DIV":
          this.incrementInput(this.tokens, "arithmeticOperators");
          break;
        case "LOGICAL_OPERATOR_NOT":
        case "LOGICAL_OPERATOR_AND_AND":
        case "LOGICAL_OPERATOR_OR_OR":
          this.incrementInput(this.tokens, "logicalOperators");
          break;
        case "ASSIGNMENT":
          this.incrementInput(this.tokens, "assignments");
          break;
        case "BRACE":
          this.incrementInput(this.tokens, "braces");
          break;
        case "PARENTHESIS":
          this.incrementInput(this.tokens, "parenthesis");
          break;
        case "RELATIONAL_OPERATOR":
        case "RELATIONAL_OPERATOR_EQUAL":
          this.incrementInput(this.tokens, "relationalOperators");
          break;
        default:
          break;
      }
    } else {
      this.incrementInput(this.tokens, "errors");
    }
  }

  startAlgorithm() {
    this.currentState = "START";
    let token = "";
    let index = 0;

    while (index < this.input.length) {
      const char = this.input[index];
      if (this.isWhiteSpace(char)) {
        this.analyzeToken(token, this.currentState);
        token = "";
        this.currentState = "START";
      } else {
        this.Advance(char);
        token += char;
      }
      index++;
    }

    if (token) {
      this.analyzeToken(token, this.currentState);
    }

    return this.tokens;
  }

  Advance(inputChar) {
    switch (this.currentState) {
      case "START":
        if (this.isAlpha(inputChar) || inputChar === "_") {
          this.currentState = "IDENTIFIER";
        } else if (this.isNumber(inputChar)) {
          this.currentState = "INTEGER";
        } else if (inputChar === '"') {
          this.currentState = "STRING_START";
        } else if (inputChar === "-") {
          this.currentState = "ARITHMETIC_OPERATOR_MINUS";
        } else if (inputChar === "+") {
          this.currentState = "ARITHMETIC_OPERATOR_PLUS";
        } else if (inputChar === "/") {
          this.currentState = "ARITHMETIC_OPERATOR_DIV";
        } else if (inputChar === "*") {
          this.currentState = "ARITHMETIC_OPERATOR_MUL";
        } else if (inputChar === "%") {
          this.currentState = "ARITHMETIC_OPERATOR_MUL";
        } else if (inputChar === "!") {
          this.currentState = "LOGICAL_OPERATOR_NOT";
        } else if (inputChar === "&") {
          this.currentState = "LOGICAL_OPERATOR_AND";
        } else if (inputChar === "|") {
          this.currentState = "LOGICAL_OPERATOR_OR";
        } else if (inputChar === "=") {
          this.currentState = "ASSIGNMENT";
        } else if (inputChar === "{" || inputChar === "}") {
          this.currentState = "BRACE";
        } else if (inputChar === "(" || inputChar === ")") {
          this.currentState = "PARENTHESIS";
        } else if (inputChar === "<" || inputChar === ">") {
          this.currentState = "RELATIONAL_OPERATOR";
        } else {
          this.currentState = "ERR";
        }
        break;
  
      case "IDENTIFIER":
        if (this.isAlpha(inputChar) || this.isNumber(inputChar) || inputChar === "_") {
          this.currentState = "IDENTIFIER";
        } else if (this.isSpecialCharacter(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "INTEGER":
        if (this.isNumber(inputChar)) {
          this.currentState = "INTEGER";
        } else if (inputChar === ".") {
          this.currentState = "DECIMAL_START";
        } else if (this.isAlpha(inputChar) || this.isSpecialCharacter(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "DECIMAL_START":
        if (this.isNumber(inputChar)) {
          this.currentState = "DECIMAL";
        } else if (this.isAlpha(inputChar) || this.isSpecialCharacter(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "DECIMAL":
        if (this.isNumber(inputChar)) {
          this.currentState = "DECIMAL";
        } else if (this.isAlpha(inputChar) || this.isSpecialCharacter(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "STRING_START":
        this.currentState = "STRING_CONTENT";
        break;
  
      case "STRING_CONTENT":
        if (inputChar === '"') {
          this.currentState = "STRING";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "STRING_CONTENT";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "STRING":
        if (inputChar === '"') {
          this.currentState = "STRING";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "STRING_CONTENT";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "ARITHMETIC_OPERATOR_PLUS":
        if (inputChar === "+") {
          this.currentState = "INCREMENT";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "INCREMENT":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "ARITHMETIC_OPERATOR_MUL":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "ARITHMETIC_OPERATOR_MINUS":
        if (this.isNumber(inputChar)) {
          this.currentState = "INTEGER";
        } else if (inputChar === "-") {
          this.currentState = "DECREMENT";
        } else if (this.isAlpha(inputChar) || this.isSpecialCharacter(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "DECREMENT":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "ARITHMETIC_OPERATOR_DIV":
        if (inputChar === "*") {
          this.currentState = "MULTILINE_COMMENT_START";
        } else if (inputChar === "/") {
          this.currentState = "LINE_COMMENT_START";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "MULTILINE_COMMENT_START":
        if (inputChar === "*") {
          this.currentState = "MULTILINE_COMMENT_END";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "MULTILINE_COMMENT_START";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "MULTILINE_COMMENT_END":
        if (inputChar === "*") {
          this.currentState = "MULTILINE_COMMENT_END";
        } else if (inputChar === "/") {
          this.currentState = "MULTILINE_COMMENT";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "MULTILINE_COMMENT_START";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "MULTILINE_COMMENT":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LINE_COMMENT_START":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "LINE_COMMENT";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LINE_COMMENT":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "LINE_COMMENT";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LOGICAL_OPERATOR_NOT":
        if (inputChar === "=") {
          this.currentState = "RELATIONAL_OPERATOR_EQUAL";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "RELATIONAL_OPERATOR":
        if (inputChar === "=") {
          this.currentState = "RELATIONAL_OPERATOR_EQUAL";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "ASSIGNMENT":
        if (inputChar === "=") {
          this.currentState = "RELATIONAL_OPERATOR_EQUAL";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "RELATIONAL_OPERATOR_EQUAL":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LOGICAL_OPERATOR_AND":
        if (inputChar === "&") {
          this.currentState = "LOGICAL_OPERATOR_AND_AND";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LOGICAL_OPERATOR_OR":
        if (inputChar === "|") {
          this.currentState = "LOGICAL_OPERATOR_OR_OR";
        } else if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LOGICAL_OPERATOR_AND_AND":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "LOGICAL_OPERATOR_OR_OR":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "BRACE":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "PARENTHESIS":
        if (!this.isWhiteSpace(inputChar)) {
          this.currentState = "ERR";
        } else {
          this.currentState = "START";
        }
        break;
  
      case "ERR":
        this.currentState = "ERR";
        break;
  
      default:
        this.currentState = "ERR";
        break;
    }
  }
  

  incrementInput(tokens, tokenType) {
    tokens[tokenType]++;
  }

  tokenize() {
    const tokens = this.startAlgorithm();
    return `
        Palabras reservadas : ${tokens.keywords}
        Identificadores : ${tokens.identifiers}
        Operadores Relacionales : ${tokens.relationalOperators}
        Operadores Lógicos : ${tokens.logicalOperators}
        Operadores Aritméticos : ${tokens.arithmeticOperators}
        Asignaciones : ${tokens.assignments}
        Número Enteros : ${tokens.integers}
        Números Decimales : ${tokens.decimalNumbers}
        Incremento : ${tokens.increment}
        Decremento : ${tokens.decrement}
        Cadena de caracteres : ${tokens.string}
        Comentario: ${tokens.comment}
        Comentario de Linea : ${tokens.lineComment}
        Paréntesis : ${tokens.parenthesis}
        Llaves : ${tokens.braces}
        Errores : ${tokens.errors}
        `;
  }
}

import { keywords } from "./keywords.js";
import { tokens } from "./tokens.js";
import { finalStates } from "./finalStates.js";

export class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = { ...tokens };
  }

  isLetter(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
  }

  isNumber(ch) {
    return ch >= "0" && ch <= "9";
  }

  isSpecialCharacter(ch) {
    return !this.isLetter(ch) && !this.isNumber(ch);
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
    let currentState = "START";
    let token = "";
    let index = 0;

    while (index < this.input.length) {
      const char = this.input[index];
      if (this.isWhiteSpace(char)) {
        this.analyzeToken(token, currentState);
        token = "";
        currentState = "START";
      } else {
        currentState = this.Advance(currentState, char);
        token += char;
      }
      index++;
    }

    if (token) {
      this.analyzeToken(token, currentState);
    }

    return this.tokens;
  }

  Advance(currentState, inputChar) {
    switch (currentState) {
      case "START":
        if (this.isLetter(inputChar) || inputChar === "_") return "IDENTIFIER";
        if (this.isNumber(inputChar)) return "INTEGER";
        if (inputChar === '"') return "STRING_START";
        if (inputChar === "-") return "ARITHMETIC_OPERATOR_MINUS";
        if (inputChar === "+") return "ARITHMETIC_OPERATOR_PLUS";
        if (inputChar === "/") return "ARITHMETIC_OPERATOR_DIV";
        if (inputChar === "*") return "ARITHMETIC_OPERATOR_MUL";
        if (inputChar === "%") return "ARITHMETIC_OPERATOR_MUL";
        if (inputChar === "!") return "LOGICAL_OPERATOR_NOT";
        if (inputChar === "&") return "LOGICAL_OPERATOR_AND";
        if (inputChar === "|") return "LOGICAL_OPERATOR_OR";
        if (inputChar === "=") return "ASSIGNMENT";
        if (inputChar === "{" || inputChar === "}") return "BRACE";
        if (inputChar === "(" || inputChar === ")") return "PARENTHESIS";
        if (inputChar === "<" || inputChar === ">")
          return "RELATIONAL_OPERATOR";

        break;

      case "IDENTIFIER":
        if (
          this.isLetter(inputChar) ||
          this.isNumber(inputChar) ||
          inputChar === "_"
        )
          return "IDENTIFIER";
        if (this.isSpecialCharacter(inputChar)) return "ERROR";
        break;
      case "INTEGER":
        if (this.isNumber(inputChar)) return "INTEGER";
        if (inputChar === ".") return "DECIMAL_START";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "DECIMAL_START":
        if (this.isNumber(inputChar)) return "DECIMAL";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "DECIMAL":
        if (this.isNumber(inputChar)) return "DECIMAL";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "STRING_START":
        return "STRING_CONTENT";
      case "STRING_CONTENT":
        if (inputChar === '"') return "STRING";
        if (!this.isWhiteSpace(inputChar)) return "STRING_CONTENT";
        break;
      case "STRING":
        if (inputChar === '"') return "STRING";
        if (!this.isWhiteSpace(inputChar)) return "STRING_CONTENT";
        break;
      case "ARITHMETIC_OPERATOR_PLUS":
        if (inputChar === "+") return "INCREMENT";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "INCREMENT":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "ARITHMETIC_OPERATOR_MUL":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "ARITHMETIC_OPERATOR_MINUS":
        if (this.isNumber(inputChar)) return "INTEGER";
        if (inputChar === "-") return "DECREMENT";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "DECREMENT":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;

      case "ARITHMETIC_OPERATOR_DIV":
        if (inputChar === "*") return "MULTILINE_COMMENT_START";
        if (inputChar === "/") return "LINE_COMMENT_START";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "MULTILINE_COMMENT_START":
        if (inputChar === "*") return "MULTILINE_COMMENT_END";
        if (!this.isWhiteSpace(inputChar)) return "MULTILINE_COMMENT_START";
        break;
      case "MULTILINE_COMMENT_END":
        if (inputChar === "*") return "MULTILINE_COMMENT_END";
        if (inputChar === "/") return "MULTILINE_COMMENT";
        if (!this.isWhiteSpace(inputChar)) return "MULTILINE_COMMENT_START";
        break;
      case "MULTILINE_COMMENT":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "LINE_COMMENT_START":
        if (!this.isWhiteSpace(inputChar)) return "LINE_COMMENT";
        break;
      case "LINE_COMMENT":
        if (!this.isWhiteSpace(inputChar)) return "LINE_COMMENT";
        break;
      case "LOGICAL_OPERATOR_NOT":
        if (inputChar === "=") return "RELATIONAL_OPERATOR_EQUAL";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "RELATIONAL_OPERATOR":
        if (inputChar === "=") return "RELATIONAL_OPERATOR_EQUAL";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "ASSIGNMENT":
        if (inputChar === "=") return "RELATIONAL_OPERATOR_EQUAL";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "RELATIONAL_OPERATOR_EQUAL":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "LOGICAL_OPERATOR_AND":
        if (inputChar === "&") return "LOGICAL_OPERATOR_AND_AND";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "LOGICAL_OPERATOR_OR":
        if (inputChar === "|") return "LOGICAL_OPERATOR_OR_OR";
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "LOGICAL_OPERATOR_AND_AND":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "LOGICAL_OPERATOR_OR_OR":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "BRACE":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;
      case "PARENTHESIS":
        if (!this.isWhiteSpace(inputChar)) return "ERROR";
        break;

      case "ERROR":
        return "ERROR";
      default:
        return "ERROR";
    }
    return "ERROR";
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

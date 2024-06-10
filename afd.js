import { keywords } from "./keywords.js";
import { tokens } from "./tokens.js";

export class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = { ...tokens };
  }

  isLetter(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
  }

  isDigit(ch) {
    return ch >= "0" && ch <= "9";
  }

  isSpecialCharacter(ch) {
    return !this.isLetter(ch) && !this.isDigit(ch);
  }

  isWhiteSpace(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n';
  }

  isKeyword(token) {
    return keywords.includes(token);
  }

  isFinalState(state) {
    return [
      "IDENTIFIER",
      "INCREMENT",
      "DECREMENT",
      "INTEGER",
      "DECIMAL",
      "MULTILINE_COMMENT",
      "LINE_COMMENT",
      "ASSIGNMENT",
      "ARITHMETIC_OPERATOR_PLUS",
      "ARITHMETIC_OPERATOR_MUL",
      "ARITHMETIC_OPERATOR_MINUS",
      "ARITHMETIC_OPERATOR_DIV",
      "RELATIONAL_OPERATOR",
      "RELATIONAL_OPERATOR_EQUAL",
      "LOGICAL_OPERATOR_NOT",
      "LOGICAL_OPERATOR_AND_AND",
      "LOGICAL_OPERATOR_OR_OR",
      "BRACE",
      "PARENTHESIS",
      "STRING",
    ].includes(state);
  }


  getNextState(currentState, inputChar) {
    switch (currentState) {
      case "START":
        if (this.isLetter(inputChar) || inputChar === "_") return "IDENTIFIER";
        if (inputChar === "+") return "ARITHMETIC_OPERATOR_PLUS";
        if (inputChar === "*" ) return "ARITHMETIC_OPERATOR_MUL";
        if(inputChar === "%") return "ARITHMETIC_OPERATOR_MUL"
        if (this.isDigit(inputChar)) return "INTEGER";
        if (inputChar === "-") return "ARITHMETIC_OPERATOR_MINUS";
        if (inputChar === "/") return "ARITHMETIC_OPERATOR_DIV";
        if (inputChar === "!") return "LOGICAL_OPERATOR_NOT";
        if (inputChar === "<" || inputChar === ">")
          return "RELATIONAL_OPERATOR";
        if (inputChar === "=") return "ASSIGNMENT";
        if (inputChar === "&") return "LOGICAL_OPERATOR_AND";
        if (inputChar === "|") return "LOGICAL_OPERATOR_OR";
        if (inputChar === "{" || inputChar === "}") return "BRACE";
        if (inputChar === "(" || inputChar === ")") return "PARENTHESIS";
        if (inputChar === '"') return "STRING_START";
        break;
      case "IDENTIFIER":
        if (
          this.isLetter(inputChar) ||
          this.isDigit(inputChar) ||
          inputChar === "_"
        )
          return "IDENTIFIER";
        if (this.isSpecialCharacter(inputChar)) return "ERROR";
        break;
      case "ARITHMETIC_OPERATOR_PLUS":
        if (inputChar === "+") return "INCREMENT";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "INCREMENT":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "ARITHMETIC_OPERATOR_MUL":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "ARITHMETIC_OPERATOR_MINUS":
        if (this.isDigit(inputChar)) return "INTEGER";
        if (inputChar === "-") return "DECREMENT";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "DECREMENT":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "INTEGER":
        if (this.isDigit(inputChar)) return "INTEGER";
        if (inputChar === ".") return "DECIMAL_START";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "DECIMAL_START":
        if (this.isDigit(inputChar)) return "DECIMAL";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "DECIMAL":
        if (this.isDigit(inputChar)) return "DECIMAL";
        if (this.isLetter(inputChar) || this.isSpecialCharacter(inputChar))
          return "ERROR";
        break;
      case "ARITHMETIC_OPERATOR_DIV":
        if (inputChar === "*") return "MULTILINE_COMMENT_START";
        if (inputChar === "/") return "LINE_COMMENT_START";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "MULTILINE_COMMENT_START":
        if (inputChar === "*") return "MULTILINE_COMMENT_END";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "MULTILINE_COMMENT_START";
        break;
      case "MULTILINE_COMMENT_END":
        if (inputChar === "*") return "MULTILINE_COMMENT_END";
        if (inputChar === "/") return "MULTILINE_COMMENT";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "MULTILINE_COMMENT_START";
        break;
      case "MULTILINE_COMMENT":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "LINE_COMMENT_START":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "LINE_COMMENT";
        break;
      case "LINE_COMMENT":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "LINE_COMMENT";
        break;
      case "LOGICAL_OPERATOR_NOT":
        if (inputChar === "=") return "RELATIONAL_OPERATOR_EQUAL";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "RELATIONAL_OPERATOR":
        if (inputChar === "=") return "RELATIONAL_OPERATOR_EQUAL";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "ASSIGNMENT":
        if (inputChar === "=") return "RELATIONAL_OPERATOR_EQUAL";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "RELATIONAL_OPERATOR_EQUAL":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "LOGICAL_OPERATOR_AND":
        if (inputChar === "&") return "LOGICAL_OPERATOR_AND_AND";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "LOGICAL_OPERATOR_OR":
        if (inputChar === "|") return "LOGICAL_OPERATOR_OR_OR";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "LOGICAL_OPERATOR_AND_AND":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "LOGICAL_OPERATOR_OR_OR":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "BRACE":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "PARENTHESIS":
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "ERROR";
        break;
      case "STRING_START":
        return "STRING_CONTENT";
      case "STRING_CONTENT":
        if (inputChar === '"') return "STRING";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "STRING_CONTENT";
        break;
      case "STRING":
        if (inputChar === '"') return "STRING";
        if (
          !this.isWhiteSpace(inputChar)
        )
          return "STRING_CONTENT";
        break;
      case "ERROR":
        return "ERROR";
      default:
        return "ERROR";
    }
    return "ERROR";
  }

  

  
  incrementToken(tokens, tokenType) {
    tokens[tokenType]++;
  }

  processToken(token, finalState) {
    if (token.trim() === "") return;

    if (this.isFinalState(finalState)) {
      switch (finalState) {
        case "IDENTIFIER":
          if (this.isKeyword(token)) {
            this.incrementToken(this.tokens, "keywords");
          } else {
            this.incrementToken(this.tokens, "identifiers");
          }
          break;
        case "INCREMENT":
          this.incrementToken(this.tokens, "increment");
          break;
        case "DECREMENT":
          this.incrementToken(this.tokens, "decrement");
          break;
        case "INTEGER":
          this.incrementToken(this.tokens, "integers");
          break;
        case "DECIMAL":
          this.incrementToken(this.tokens, "decimalNumbers");
          break;
        case "MULTILINE_COMMENT":
          this.incrementToken(this.tokens, "comment");
          break;
        case "LINE_COMMENT":
          this.incrementToken(this.tokens, "lineComment");
          break;
        case "ASSIGNMENT":
          this.incrementToken(this.tokens, "assignments");
          break;
        case "ARITHMETIC_OPERATOR_PLUS":
        case "ARITHMETIC_OPERATOR_MUL":
        case "ARITHMETIC_OPERATOR_MINUS":
        case "ARITHMETIC_OPERATOR_DIV":
          this.incrementToken(this.tokens, "arithmeticOperators");
          break;
        case "RELATIONAL_OPERATOR":
        case "RELATIONAL_OPERATOR_EQUAL":
          this.incrementToken(this.tokens, "relationalOperators");
          break;
        case "LOGICAL_OPERATOR_NOT":
        case "LOGICAL_OPERATOR_AND_AND":
        case "LOGICAL_OPERATOR_OR_OR":
          this.incrementToken(this.tokens, "logicalOperators");
          break;
        case "BRACE":
          this.incrementToken(this.tokens, "braces");
          break;
        case "PARENTHESIS":
          this.incrementToken(this.tokens, "parentheses");
          break;
        case "STRING":
          this.incrementToken(this.tokens, "string");
          break;
        default:
          break;
      }
    } else {
      this.incrementToken(this.tokens, "errors");
    }
  }

  analyze() {
    let currentState = "START";
    let token = "";

    for (const char of this.input) {
      if (char === " " || char === "\n" || char === "\t") {
        this.processToken(token, currentState);
        token = "";
        currentState = "START";
      } else {
        currentState = this.getNextState(currentState, char);
        token += char;
      }
    }

    if (token) {
      this.processToken(token, currentState);
    }

    return this.tokens;
  }

  tokenize() {
    const tokens = this.analyze();
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
        Paréntesis : ${tokens.parentheses}
        Llaves : ${tokens.braces}
        Errores : ${tokens.errors}
        `;
  }
}



import { keywords } from "./const/keywords.js";
import { emptyResults } from "./const/emptyResults.js";
import { finalStates } from "./const/finalStates.js";
import { specialCharacters } from "./const/specialCharacters.js";

export class Lexer {

  constructor(input) {
    this.input = input;
    this.results = { ...emptyResults };
    this.currentState = "";
  }


  isAlpha(ch) {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
  }

  isNumber(ch) {
    return ch >= "0" && ch <= "9";
  }

  isSpecialCharacter(ch) {
    return specialCharacters.includes(ch);
  }

  isWhiteSpace(ch) {
    return ch === " " || ch === "\n" || ch === "\t" ;
  }

  isKeyword(string) {
    return keywords.includes(string);
  }

  isEmptyString(string) {
    return string.trim() === "";
  }

  isFinalState(state) {
    return finalStates.includes(state);
  }

  analyzeString(string, finalState) {

    if (this.isEmptyString(string)) {
      return; 
    }

    if (this.isFinalState(finalState)) {
      switch (finalState) {
        case "IDENTIFIER":
          if (this.isKeyword(string)) {
            this.incrementResults(this.results, "keywords");
          } else {
            this.incrementResults(this.results, "identifiers");
          }
          break;
        case "INTEGER":
          this.incrementResults(this.results, "integers");
          break;
        case "DECIMAL":
          this.incrementResults(this.results, "decimalNumbers");
          break;
        case "STRING":
          this.incrementResults(this.results, "string");
          break;
        case "DECREMENT":
          this.incrementResults(this.results, "decrement");
          break;
        case "INCREMENT":
          this.incrementResults(this.results, "increment");
          break;
        case "MULTILINE_COMMENT":
          this.incrementResults(this.results, "comment");
          break;
        case "LINE_COMMENT":
          this.incrementResults(this.results, "lineComment");
          break;

        case "ARITHMETIC_OPERATOR_PLUS":
        case "ARITHMETIC_OPERATOR_MUL":
        case "ARITHMETIC_OPERATOR_MOD":
        case "ARITHMETIC_OPERATOR_MINUS":
        case "ARITHMETIC_OPERATOR_DIV":
          this.incrementResults(this.results, "arithmeticOperators");
          break;
        case "LOGICAL_OPERATOR_NOT":
        case "LOGICAL_OPERATOR_AND_AND":
        case "LOGICAL_OPERATOR_OR_OR":
          this.incrementResults(this.results, "logicalOperators");
          break;
        case "ASSIGNMENT":
          this.incrementResults(this.results, "assignments");
          break;
        case "BRACE":
          this.incrementResults(this.results, "braces");
          break;
        case "PARENTHESIS":
          this.incrementResults(this.results, "parenthesis");
          break;
        case "RELATIONAL_OPERATOR":
        case "RELATIONAL_OPERATOR_EQUAL":
          this.incrementResults(this.results, "relationalOperators");
          break;
        default:
          break;
      }
    } else {
      this.incrementResults(this.results, "errors");
    }
  }


  startAlgorithm() {
      this.currentState = "START";
      let string = "";
      let index = 0;
  
      const processCurrentString = () => {
          if (string.length > 0) {
              this.analyzeString(string, this.currentState);
              string = "";
              this.currentState = "START";
          }
      };
  
      while (index < this.input.length) {
          const char = this.input[index];
          if (this.isWhiteSpace(char)) {
              processCurrentString();
          } else {
              this.Advance(char);
              string += char;
          }
          index++;
      }
  
      processCurrentString();
  
      return this.results;
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
          this.currentState = "ARITHMETIC_OPERATOR_MOD";
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
        case "DECREMENT":
        if (!this.isWhiteSpace(inputChar)) {
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
  
      case "ARITHMETIC_OPERATOR_PLUS":
        if (inputChar === "+") {
          this.currentState = "INCREMENT";
        } else if (!this.isWhiteSpace(inputChar)) {
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
      
      case "ARITHMETIC_OPERATOR_MOD":
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
  

  incrementResults(results, stringType) {
    results[stringType]++;
  }

  start() {
    const results = this.startAlgorithm();
    return `
        Palabras reservadas : ${results.keywords}
        Identificadores : ${results.identifiers}
        Operadores Relacionales : ${results.relationalOperators}
        Operadores Lógicos : ${results.logicalOperators}
        Operadores Aritméticos : ${results.arithmeticOperators}
        Asignaciones : ${results.assignments}
        Número Enteros : ${results.integers}
        Números Decimales : ${results.decimalNumbers}
        Incremento : ${results.increment}
        Decremento : ${results.decrement}
        Cadena de caracteres : ${results.string}
        Comentario: ${results.comment}
        Comentario de Linea : ${results.lineComment}
        Paréntesis : ${results.parenthesis}
        Llaves : ${results.braces}
        Errores : ${results.errors}
        `;
  }
}

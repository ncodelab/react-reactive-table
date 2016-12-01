import {parser} from '../parser.jsx';
import {copyObject} from './Util.jsx';
import {step} from '../components/SimpleQueryInput.jsx';

class Filter {

  /**
   * @param availableColumns {Array.<Column>}
   * @param parseWasOk {function(string)}
   * @param lastFilterQuery {string}
   */
  constructor(availableColumns, parseWasOk, lastFilterQuery) {


    this.__parseWasOk = parseWasOk;

    this.__availableColumns = availableColumns;

    this.__lastSuccessfullExpression = '';

    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__LOGIC_SYNTAX = {
      //Intersection
      '&&': (lRows = [], rRows = []) => lRows.filter((n) => rRows.indexOf(n) !== -1),
      //Concatenation with deduplicate;
      '||': (lRows = [], rRows = []) => [...new Set(lRows.concat(rRows)).values()]
    };

    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__CHECK_SYNTAX = {
      '[empty]': (value) => value == '',
      '[nonempty]': (value) => value != ''
    };


    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__SEARCH_SYNTAX = {
      '<': (value, expectation) => {
       return  parseFloat(value) < parseFloat(expectation)
      },
      '<=': (value, expectation) => {
        return  parseFloat(value) <= parseFloat(expectation)
      },
      '>': (value, expectation) => {
        return  parseFloat(value) > parseFloat(expectation)
      },
      '>=': (value, expectation) => {
        return  parseFloat(value) >= parseFloat(expectation)
      },
      '=': (value, expectation) => {
        return value == expectation
      },
      '*': (value, expectation) => {
        if (typeof value === 'string') {
          return value.indexOf(expectation) !== -1
        } else {
          return value.toString().indexOf(expectation) !== -1
        }
      },
      '!': (value, expectation) => {
        if (typeof value === 'string') {
          return value.indexOf(expectation) === -1
        } else {
          return value.toString().indexOf(expectation) === -1
        }
      },
      '{': (value, expectation) => {
        if (typeof value === 'string') {
          return value.startsWith(expectation)
        } else {
          return value.toString().startsWith(expectation)
        }
      },
      '}': (value, expectation) => {
        if (typeof value === 'string') {
          return value.endsWith(expectation)
        } else {
          return value.toString().endsWith(expectation)
        }
      }
    };

    this.__parsedExpression = undefined;

    this.lastError = '';

    this.expression = "";
    this.setExpression(lastFilterQuery)
  }


  setExpression(expression) {
    this.expression = expression;
    this.__parseExpression(expression.trim());
  }


  __parseExpression(expression) {
    this.lastError = '';
    let lastExpression = copyObject(this.__parsedExpression);
    if (expression.length > 0) {
      try {
        this.__parsedExpression = parser.parse(expression);
      } catch (e) {
        this.lastError = e.message;
      }
    } else {
      this.__parsedExpression = undefined;
    }

    if (JSON.stringify(copyObject(this.__parsedExpression)) !== JSON.stringify(lastExpression)) {
      this.__lastSuccessfullExpression = expression;
      this.__parseWasOk(this.__lastSuccessfullExpression);
      this.__markColumns(expression);
    }
  }

  static __isTermValid(term) {
    return term['col'] && term['act'] && term['exp']
  }


  static __isInterColumnTermValid(term) {
    return term['col1'] && term['col2'] && term['act'];
  }

  static __isNonArgumentedTermValid(term) {
    return term['col'] && term['check'];
  }

  static __isExpressionValid(expression) {
    return expression['l'] && expression['r'] && expression['op'];
  }


  __reduceTerm(rows, term) {
    let {col: columnName, act: action, exp: expectation} = term;
    return rows.filter((row) => {
      let value = row.getValueByColumnName(columnName);
      let valueAsFloat = parseFloat(value);
      let expectationAsFloat = parseFloat(expectation);
      if (value) {
        return this.__SEARCH_SYNTAX[action](value.toString(), expectation.toString().trim());
      }
      return false;
    });
  }

  __reduceInterColumnTerm(rows, term) {
    let {col1: firstColumnName, col2: secondColumnName, act: action} = term;
    return rows.filter((row) => {
      let firstValue = row.getValueByColumnName(firstColumnName);
      let secondValue = row.getValueByColumnName(secondColumnName);
      if (firstValue && secondValue) {
        return this.__SEARCH_SYNTAX[action](firstValue.toString(), secondValue.toString())
      }
      return false;
    })
  }

  __reduceNonArgumentedTerm(rows, term) {
    let {col: columnName, check} = term;
    return rows.filter((row) => {
      let value = row.getValueByColumnName(columnName);
      return this.__CHECK_SYNTAX[check](value.toString());
    })
  }

  __reduceExpression(expression) {
    let {l: left, r: right, op: operation} = expression;
    let a = this.__LOGIC_SYNTAX[operation](left, right);
    return a;
  }

  __reduceTree(rows, tree) {
    if (Filter.__isExpressionValid(tree)) {
      tree['l'] = this.__reduceTree(rows, tree['l']);
      tree['r'] = this.__reduceTree(rows, tree['r']);
      return this.__reduceExpression(tree);
    }
    if (Filter.__isTermValid(tree)) {
      return this.__reduceTerm(rows, tree);
    }
    if (Filter.__isInterColumnTermValid(tree)) {
      return this.__reduceInterColumnTerm(rows, tree);
    }
    if (Filter.__isNonArgumentedTermValid(tree)) {
      return this.__reduceNonArgumentedTerm(rows, tree);
    }
  }


  filterRow(rows) {
    if (this.__parsedExpression) {
      return this.__reduceTree(rows, copyObject(this.__parsedExpression));
    } else {
      return rows;
    }
  }


  __markColumns(expression) {
    this.__availableColumns.forEach((column) => {
      if (expression.indexOf(column.name) !== -1) {
        column.setInFilterExpression(true);
      } else {
        column.setInFilterExpression(false);
      }
    });
  };
}




export const reduceAstToState = (ast) => {
  if (Filter.__isExpressionValid(ast)) {
    ast['l'] = reduceAstToState(ast['l']);
    ast['r'] = reduceAstToState(ast['r']);
    return __reduceExpression(ast);
  }
  if (Filter.__isTermValid(ast)) {
    return __reduceTerm(ast);
  }
  if (Filter.__isInterColumnTermValid(ast)) {
    return __reduceInterColumnTerm(ast);
  }
  if (Filter.__isNonArgumentedTermValid(ast)) {
    return __reduceNonArgumentedTerm(ast);
  }
};

const __reduceExpression = (ast) => {
  return {
    items: [...ast.l.items, ast.op, ...ast.r.items],
    steps: [...ast.l.steps, step.LOGIC, ...ast.r.steps]
  }
};


const __reduceTerm = (ast) => {
  return {
    items: ['"' + ast.col + '"', ast.act, ast.exp],
    steps: [step.COLUMN, step.ACTION, step.VALUE]
  }
};


const __reduceInterColumnTerm = (ast) => {
  return {
    items: ['"' + ast.col1 + '"', ast.act, '"' + ast.col2 + '"'],
    steps: [step.COLUMN, step.ACTION, step.VALUE]
  }
};


const __reduceNonArgumentedTerm = (ast) => {
  return {
    items: ['"' + ast.col + '"', ast.check],
    steps: [step.COLUMN, step.ACTION]
  }
};


export default Filter;

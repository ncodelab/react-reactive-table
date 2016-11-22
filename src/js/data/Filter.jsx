import parser from '../parser.jsx';

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
      '&&': (lRows = [], rRows = []) =>  lRows.filter((n) => rRows.indexOf(n) !== -1),
      //Concatenation with deduplicate;
      '||': (lRows = [], rRows = []) => [...new Set(lRows.concat(rRows)).values()]
    };

    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__SEARCH_SYNTAX = {
      '<': (value, expectation) => value < expectation,
      '<=': (value, expectation) => value <= expectation,
      '>': (value, expectation) => value > expectation,
      '>=': (value, expectation) => value >= expectation,
      '=': (value, expectation) => value == expectation,
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
    var lastExpression = this.__parsedExpression;
    try {
      this.__parsedExpression = parser.parse(expression, {'startRule': 'Expression'});
    } catch (e) {
      this.lastError = e.message;
    }

    if (JSON.stringify(this.__parsedExpression) !== JSON.stringify(lastExpression)) {
      this.__lastSuccessfullExpression = expression;
      this.__parseWasOk(this.__lastSuccessfullExpression);
      this.__markColumns(expression);
    }
  }

  static __isTermValid(term) {
    return term['col'] && term['act'] && term['exp']
  }

  static __isExpressionValid(expression) {
    return expression['l'] && expression['r'] && expression['op'];
  }

  __reduceTerm(rows, term) {
    let {col: columnName, act: action, exp: expectation} = term;
    return rows.filter((row) => {
      let value = row.getValueByColumnName(columnName);
      if (value) {
        return this.__SEARCH_SYNTAX[action](value, expectation);
      }
      return true;
    });
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
  }


  filterRow(rows) {
    if (this.__parsedExpression) {
      return this.__reduceTree(rows, Object.assign({}, this.__parsedExpression));
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

export default Filter;
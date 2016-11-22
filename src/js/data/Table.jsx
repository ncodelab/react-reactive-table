import Column from './Column.jsx';
import Row from './Row.jsx';
import Filter from './Filter.jsx';

class Table {
  constructor(columnNames, rows, exportLastFilterQuery, filterQueryForBootstrap) {
    /**
     * @type {{String, Row}}
     */
    this.rows = {};

    /**
     * @type {Array<Column>}
     */
    this.columns = [];

    columnNames.forEach(columnName => {
      this.columns.push(new Column(columnName));
    });

    rows.forEach((row) => {
      let rowClass = new Row(row.key, this.columns, row);
      this.rows[rowClass.key] = rowClass;
    });

    this.sorting = {
      'column': null,
      'order': true
    };

    this.filter = new Filter(this.columns, exportLastFilterQuery, filterQueryForBootstrap,);
  }

  /**
   * @param rowsUpdate Array<{{String, String}}>
   */
  updateRows(rowsUpdate) {
    rowsUpdate.forEach((rowUpdate) => {
      if (this.rows[rowUpdate.key]) {
        this.columns.forEach(column => {
          if (rowUpdate[column.name]) {
            this.rows[rowUpdate.key].updateValue(column.name, rowUpdate[column.name])
          }
        });
      } else {
        let newRow = new Row(rowUpdate.key, this.columns, rowUpdate);
        this.rows[newRow.key] = newRow;
      }
    });
    return this;
  }

  setColumnVisibility(columnName, visibility) {
    this.columns.forEach((column) => {
      if (column.name == columnName) {
        column.setVisibility(visibility)
      }
    });
    return this;
  }

  exportSortedRows(rows) {
    if (this.sorting.column) {
      return rows.sort((rowA, rowB) => {
        let valueA = rowA.getValueByColumnName(this.sorting.column);
        let valueB = rowB.getValueByColumnName(this.sorting.column);

        if (this.sorting.order) {
          if (valueA < valueB) {
            return -1;
          } else if (valueA > valueB) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (valueA > valueB) {
            return -1;
          } else if (valueA < valueB) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    } else {
      return rows;
    }
  }

  exportFilteredRows(rows) {
    return this.filter.filterRow(rows);
  }

  /**
   * @returns Array.<Row>
   */
  exportRows() {
    let rowsArray = Object.keys(this.rows)
        .map((rowKey) => this.rows[rowKey]);

    return this.exportSortedRows(this.exportFilteredRows(rowsArray));
  }

  setSorting(columnName, order) {
    this.sorting.column = columnName;
    this.sorting.order = order;
    return this;
  }

  setFilterExpression(expression) {
    this.filter.setExpression(expression);
    return this;
  }

  static empty() {
    return new Table([], [], (expression)=> expression, "");
  }

  getFilterExpression() {
    return this.filter.expression;
  }

  getFilterError() {
    return this.filter.lastError;
  }

}


export default Table;

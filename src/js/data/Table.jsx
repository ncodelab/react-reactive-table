import Column from './Column.jsx';
import Row from './Row.jsx';
import Filter from './Filter.jsx';
import {
  moveSide
} from '../components/ColumnView.jsx';

class Table {
  constructor(columnNames, rows, exportLastFilterQuery, filterQueryForBootstrap,
              pageSize) {
    /**
     * @type {{String, Row}}
     */
    this.rows = {};

    this.initialColumnOrder = [];
    /**
     * @type {Array<Column>}
     */
    this.columns = [];

    columnNames.forEach(columnName => {
      this.columns.push(new Column(columnName));
    });

    this.initialColumnOrder = this.columns.slice();

    rows.forEach((row) => {
      let rowClass = new Row(row.key, this.columns, row);
      this.rows[rowClass.key] = rowClass;
    });

    this.ordering = {
      'column': null,
      'order': true
    };

    this.pageSize = pageSize;

    this.currentPage = 1;

    this.filter = new Filter(this.columns, exportLastFilterQuery,
        filterQueryForBootstrap,);
  }

  getMaxPage() {
    return Math.ceil(Object.keys(this.exportFilteredRows(this.getRowsArray()))
            .length / this.pageSize);
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
    return this;
  }

  resetColumnOrdering() {
    while (this.columns.pop() != undefined) {
      this.columns.pop();
    }

    this.initialColumnOrder.forEach((column, idx) => {
      this.columns[idx] = column;
    });
    return this;
  }

  reorderColumn(side, columnName) {

    for (let idx = 0; idx < this.columns.length; idx++) {
      if (this.columns[idx].name === columnName) {
        if (side === moveSide.RIGHT) {
          for (let visibleIdx = 1;
               (visibleIdx + idx) < this.columns.length; visibleIdx++) {
            if (this.columns[idx + visibleIdx].visibility) {
              const buff = this.columns[idx + visibleIdx];
              this.columns[idx + visibleIdx] = this.columns[idx];
              this.columns[idx] = buff;

              break;
            }
          }
          break;

        } else if (side === moveSide.LEFT) {
          for (let visibleIdx = 1; (idx - visibleIdx) >= 0; visibleIdx++) {
            if (this.columns[idx - visibleIdx].visibility) {
              const buff = this.columns[idx - visibleIdx];
              this.columns[idx - visibleIdx] = this.columns[idx];
              this.columns[idx] = buff;
              break;
            }
          }
          break;
        }
      }
    }

    return this;
  }

  setCurrentPage(pageNum) {
    this.currentPage = pageNum;
    return this;
  }

  /**
   * @param rowsUpdate Array<{{String, String}}>
   */
  updateRows(rowsUpdate) {
    rowsUpdate.forEach((rowUpdate) => {
      if (this.rows[rowUpdate.key]) {
        this.columns.forEach(column => {
          if (rowUpdate[column.name]) {
            this.rows[rowUpdate.key].updateValue(column.name,
                rowUpdate[column.name])
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

  exportOrderedRows(rows) {
    if (this.ordering.column) {
      return rows.sort((rowA, rowB) => {
        let valueA = rowA.getValueByColumnName(this.ordering.column);
        let valueB = rowB.getValueByColumnName(this.ordering.column);

        if (this.ordering.order) {
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

  getRowsArray() {
    return Object.keys(this.rows)
        .map((rowKey) => this.rows[rowKey]);
  }

  /**
   * @returns Array.<Row>
   */
  exportRows() {
    let orderedRows = this.exportOrderedRows(this.exportFilteredRows(this.getRowsArray()));

    return orderedRows.slice((this.currentPage - 1) * this.pageSize, this.currentPage *
        this.pageSize)
  }

  setOrdering(columnName, order) {
    this.ordering.column = columnName;
    this.ordering.order = order;
    return this;
  }

  setFilterExpression(expression) {
    this.setCurrentPage(1);
    this.filter.setExpression(expression);
    return this;
  }

  static empty() {
    return new Table([], [], (expression) => expression, "");
  }

  getFilterExpression() {
    return this.filter.expression;
  }

  getFilterError() {
    return this.filter.lastError;
  }

}

export default Table;

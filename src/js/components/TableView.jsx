import React from 'react'
import Header from './Header.jsx'
import RowView from './RowView.jsx'
import FilterView from './FilterView.jsx'
import PaginationView from './PaginationView.jsx'
import Table from '../data/Table.jsx';
class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapped = false;
  }

  columnMoveHandler(side, columnName) {
    this.setState({
      td: this.state.td.reorderColumn(side, columnName)
    })
  }

  columnMoveReset() {
    this.setState({td: this.state.td.resetColumnOrdering()})
  }

  handlePageSet(pageNum) {
    this.setState({td: this.state.td.setCurrentPage(pageNum)})
  }

  filterHandler(expression) {
    this.setState({td: this.state.td.setFilterExpression(expression)})
  }

  columnsVisibilityHandler(column, value) {
    this.setState({
      td: this.state.td.setColumnVisibility(column, value)
    });
  }
  columnOrderingHandler(columnName, order) {
    this.setState({
      td: this.state.td.setOrdering(columnName, order)
    });
  }
  resetOrdering() {
    this.setState({
      td: this.state.td.setOrdering(null, null)
    });
  }
  bootstrapTable(data, filterQueryExporter, filterQuery, pageSize) {
    this.bootstrapped = true;
    this.setState({
      td: new Table(data.columns, data.rows, filterQueryExporter, filterQuery, pageSize)
    });
  }
  updateTable(data) {
    this.setState({
      td: this.state.td.updateRows(data.rows)
    });
  }
  componentWillMount() {
    this.setState({td: Table.empty()});
  }
  componentDidMount() {
    let {
      socket,
      eventName,
      filterQueryExporter = (expression) => expression,
      filterQuery = "",
      pageSize = 50
    } = this.props;
    socket.on(eventName, (data) => {
      if (data && data.columns && data.rows && !this.bootstrapped) {
        this.bootstrapTable(data, filterQueryExporter, filterQuery, pageSize);
      } else if (data && data.rows) {
        this.updateTable(data);
      }
    })
  }

  render() {
    let {td: table} = this.state;
    if (table.columns.length > 0) {
      return (
        <div className="container-fluid">
          <FilterView
            table={table}
            filterHandler={(expr) => this.filterHandler(expr)}
            columnsVisibilityHandler={(column, value) => this.columnsVisibilityHandler(column, value)}
            resetOrdering={() => this.resetOrdering()}
            resetColumnOrdering={() => this.columnMoveReset()}/>
          <PaginationView table={table} handlePageSet={(pageNum) => this.handlePageSet(pageNum)}/>
          <table className="table table-responsive table-bordered">
            <Header
              columnMoveHandler={(s, c) => {
              this.columnMoveHandler(s, c)
            }}
              columns={table.columns}
              visibleColumns={table.columns.filter(col => col.visibility)}
              columnOrderingHandler={(columnName, order) => this.columnOrderingHandler(columnName, order)}
              orderingColumn={table.ordering.column}/>
            <tbody>
              {table.exportRows().map(row => <RowView key={row.key} row={row}/>)}
            </tbody>
          </table>
          <PaginationView table={table} handlePageSet={(pageNum) => this.handlePageSet(pageNum)}/>
        </div>
      )
    }
    return (null);
  };
}
export default TableView;

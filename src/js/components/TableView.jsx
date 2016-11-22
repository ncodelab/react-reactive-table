import React from 'react'
import Header from './Header.jsx'
import RowView from './RowView.jsx'
import FilterView from './FilterView.jsx'

import Table from '../data/Table.jsx';

class TableView extends React.Component {
  constructor(props) {
    super(props);
  }

  filterHandler(expression) {
    this.setState({td: this.state.td.setFilterExpression(expression)})
  }

  columnsVisibilityHandler(column, value) {
    this.setState({td: this.state.td.setColumnVisibility(column, value)});
  }

  columnSortingHandler(columnName, order) {
    this.setState({td: this.state.td.setSorting(columnName, order)});
  }

  bootstrapTable(data, filterQueryExporter, filterQuery) {
    this.setState({
      td: new Table(
          data.columns,
          data.rows,
          filterQueryExporter,
          filterQuery)
    });
  }

  updateTable(data) {
    this.setState({td: this.state.td.updateRows(data.rows)});
  }

  componentWillMount() {
    this.setState({td: Table.empty()});
  }

  componentDidMount() {
    let {socket, eventName, filterQueryExporter = (expression)=> expression, filterQuery = ""} = this.props;
    socket.on(eventName, (data) => {
      if (data && data.columns && data.rows) {
        this.bootstrapTable(data, filterQueryExporter, filterQuery);
      } else if (data && data.rows) {
        this.updateTable(data);
      }
    })
  }


  render() {

    let {td: table} = this.state;

    return (
        <div className="container-fluid">

          <FilterView
              table={table}
              filterHandler={(expr) => this.filterHandler(expr)}
              columnsVisibilityHandler={(column, value) => this.columnsVisibilityHandler(column, value)}/>

          <table className="table table-bordered">
            <Header
                columns={table.columns}
                columnSortingHandler={(columnName, order) => this.columnSortingHandler(columnName, order)}/>

            <tbody>
            {table.exportRows().map(row => <RowView
                key={row.key}
                row={row}/>)}
            </tbody>
          </table>
        </div>
    )
  };
}

export default TableView;

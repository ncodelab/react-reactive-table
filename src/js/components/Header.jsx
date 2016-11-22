import React from 'react'

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  setSorting(columnName, order) {
    this.setState({
      columnName: columnName,
      order: order
    });
  }

  componentWillMount() {
    this.setSorting(null, null);
  }

  toggleSorting(columnName) {
    let order = true;
    if (this.state.columnName !== columnName) {
      this.setSorting(columnName, true)
    } else {
      order = !this.state.order;
      this.setSorting(columnName, order)
    }
    return order;
  }

  sortingIconClass(columnName) {
    if (this.state.columnName !== columnName) {
      return "glyphicon glyphicon-sort";
    } else if (this.state.columnName === columnName && this.state.order) {
      return "glyphicon glyphicon-sort-by-attributes";
    } else if (this.state.columnName === columnName && !this.state.order) {
      return "glyphicon glyphicon-sort-by-attributes-alt";
    } else {
      return "glyphicon glyphicon-sort";
    }
  }

  render() {

    let {columns, columnSortingHandler}= this.props;

    let style = {
      resize: 'horizontal',
      overflow: 'auto'
    };

    return (
        <thead>
        <tr>
          {columns.map(column => {
            if (column.visibility) {
              return (
                  <th style={style}
                      className={column.inFilterExpression ? "col-md-1 active" : "col-md-1" }
                      key={column.name}>
                    <div>
              <span className={this.sortingIconClass(column.name)}
                    aria-hidden="true"
                    onClick={() => {
                      columnSortingHandler(column.name, this.toggleSorting(column.name));
                    }}/>
                      &nbsp;{column.name}
                    </div>

                  </th>);
            }
          })}
        </tr>
        </thead>
    )
  };
}

export default Header;

import React from 'react'


class ColumnView extends React.Component {
  constructor(props) {
    super(props);
  }

  orderingIconClass(columnName, orderingColumnName) {
    if (orderingColumnName !== columnName) {
      return "glyphicon glyphicon-sort";
    } else if (orderingColumnName === columnName && this.props.order) {
      return "glyphicon glyphicon-sort-by-attributes";
    } else if (orderingColumnName === columnName && !this.props.order) {
      return "glyphicon glyphicon-sort-by-attributes-alt";
    } else {
      return "glyphicon glyphicon-sort";
    }
  }

  render() {


    let {
        column,
        orderedByColumn,
        columnOrderingHandler,
        notLast,
        width
    } = this.props;

    const style = {};

    if (notLast) {
      style['borderRight'] = '0px';
    } else {
      style['borderRight'] = undefined;
    }

    if (width) {
      style['width'] = width + 'px'
    }

    return (<th key={column.name}
                style={style}
                className={column.inFilterExpression ? "active" : "" }>
              <span
                  className={this.orderingIconClass(column.name, orderedByColumn)}
                  onClick={() => columnOrderingHandler(column.name)}/>
      &nbsp;{column.name}

    </th>);
  };
}

export default ColumnView;

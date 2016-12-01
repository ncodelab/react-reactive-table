import React from 'react'
export const moveSide = {
  RIGHT: 'right',
  LEFT: 'left'
}
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
        width,
        first,
        last,
        columnMoveHandler
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
    return (
        <th key={column.name} style={style} className={column.inFilterExpression
            ? "active"
            : ""}>
          {!first
              ? <span className="glyphicon glyphicon-arrow-left"
                      onClick={() => columnMoveHandler(moveSide.LEFT, column.name)}/>
              : null}
          &nbsp;
          <span className={this.orderingIconClass(column.name, orderedByColumn)}
                onClick={() => columnOrderingHandler(column.name)}/>
          &nbsp;{column.name} {!last && notLast
            ? <span style={{
          float: 'right',
          marginRight: '-15px',
          marginTop: '1px'
        }} className="glyphicon glyphicon-arrow-right"
                    onClick={() => columnMoveHandler(moveSide.RIGHT, column.name)}/>
            : null}
        </th>
    );
  };
}
export default ColumnView;

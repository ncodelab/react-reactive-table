import React from 'react';
import ReactDOM from 'react-dom';
import ColumnResizerView from './ColumnResizerView.jsx';
import ColumnView from './ColumnView.jsx';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  setOrdering(columnName, order) {
    this.setState({
      columnName: columnName,
      order: order
    });
  }

  toggleOrdering(columnName) {
    let order = true;
    if (this.state.columnName !== columnName) {
      this.setOrdering(columnName, true)
    } else {
      order = !this.state.order;
      this.setOrdering(columnName, order)
    }
    return order;
  }

  handleWidthChange(currentX, initialX, leftColumn, rightColumn) {
    const diff = initialX - currentX;

    const newState = Object.assign({}, this.state.columnsWidth);

    const leftKey = `columnsWidth.${leftColumn}`;
    const rightKey = `columnsWidth.${rightColumn}`;

    newState[rightColumn] = newState[rightColumn] + diff > 0 ? newState[rightColumn] + diff : 0;
    newState[leftColumn] = newState[leftColumn] - diff > 0 ? newState[leftColumn] - diff : 0;

    this.setState({columnsWidth: newState})
  }

  updateWidth() {
    this.setState({
      elWidth: ReactDOM.findDOMNode(this).getBoundingClientRect().width
    })
  }

  recalculateWidth() {
    const columns = this.props.columns;
    const currentSizes = this.state.columnsWidth;
    const width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;

    const state = {};
    let initialState = 0;

    const multipliers = {};

    columns.forEach(column => {
      if (initialState) {
        multipliers[column.name] = (currentSizes[column.name] / initialState );
      } else {
        initialState = currentSizes[column.name];
        multipliers[column.name] = 1
      }
    });

    const multipliersSum =
        Object.keys(multipliers).reduce((a, b) => a + multipliers[b], 0);

    const columnWidth = Math.floor(width / multipliersSum);

    columns.forEach(column => {
      state[column.name] = multipliers[column.name] * columnWidth;
    });

    this.setState({columnsWidth: state})
  }


  populateColumns(columns, silent) {
    const width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
    const columnWidth = Math.floor(width / columns.length);

    const state = {};

    columns.forEach((column) => {
      state[column.name] = columnWidth;
    });

    if (!silent) {
      this.setState({columnsWidth: state});
    }
    return state;
  }

  initState() {
    this.setState(
        {
          columnName: null,
          order: null,
          columnsWidth: {}
        }
    )
  }

  componentDidMount() {
    this.updateWidth();
    this.populateColumns(this.props.columns);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.recalculateWidth());
  }

  componentWillMount() {
    this.initState();
    window.addEventListener("resize", () => this.recalculateWidth());
  }


  render() {

    let {columns, columnOrderingHandler, orderingColumn}= this.props;
    let {columnsWidth} = this.state;

    return (
        <thead>
        <tr>
          {columns.map((column, idx) => {
            if (column.visibility) {
              const notLast = idx < (columns.length - 1);

              let result = [
                <ColumnView
                    column={column}
                    orderedByColumn={orderingColumn}
                    notLast={notLast}
                    width={columnsWidth[column.name]}
                    order={this.state.order}
                    columnOrderingHandler={(columnName) => columnOrderingHandler(columnName, this.toggleOrdering(columnName))}/>
              ];

              if (notLast) {
                result.push(<ColumnResizerView
                    handleWidthChange={(curX, initX) => this.handleWidthChange(curX, initX, column.name, columns[idx + 1].name)}
                />)
              }

              return (result);
            }
          })}
        </tr>
        </thead>
    )
  };
}

export default Header;

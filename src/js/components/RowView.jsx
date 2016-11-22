import React from 'react'


class RowView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    /**
     * @type {Row}
     */
    let row = this.props.row;

    return (
        <tr>
          {row.columns.map(column => column.visibility ?
              <td>{row.getValue(column)}</td> : null)}
        </tr>
    )
  };
}

export default RowView;

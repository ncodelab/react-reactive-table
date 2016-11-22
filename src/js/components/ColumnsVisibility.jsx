import React from 'react';

class ColumnsVisibility extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let {onChange, columns} = this.props;

    return (
        <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
          <label className="control-label">Hide columns</label>
          <br/>
          {columns.map(column => {
            return (
                <label className="checkbox-inline" key={column.name}>
                  <input type="checkbox"
                         value=""
                         onChange={(evt) => {
                           onChange(column.name, !evt.target.checked)
                         }}/>
                  {column.name}
                </label>
            )
          })}
        </div>
    )
  }
}

export default ColumnsVisibility;

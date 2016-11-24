import React from 'react';

import QueryInput from './QueryInput.jsx'
import ColumnsVisibility from './ColumnsVisibility.jsx'


class FilterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let {table, filterHandler, columnsVisibilityHandler, resetOrdering} = this.props;

    return (
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Table filtering</h3>
          </div>

          <div className="panel-body">

            <QueryInput onChange={filterHandler}
                        query={table.getFilterExpression()}
                        error={table.getFilterError()}/>

            <ColumnsVisibility columns={table.columns}
                               onChange={columnsVisibilityHandler}/>

            <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
              <label className="control-label">Ordering</label>
              <br/>
              <button type="button" className="btn btn-danger"
                      onClick={resetOrdering}> Reset
              </button>
            </div>
          </div>
        </div>
    )
  }
}

export default FilterView;

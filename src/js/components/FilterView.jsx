import React from 'react';

import QueryInput from './QueryInput.jsx'
import ColumnsVisibility from './ColumnsVisibility.jsx'


class FilterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let {table, filterHandler, columnsVisibilityHandler} = this.props;

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
          </div>
        </div>
    )
  }
}

export default FilterView;

import React from 'react';
import QueryInput from './QueryInput.jsx'
import ColumnsVisibility from './ColumnsVisibility.jsx'
class FilterView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {table, filterHandler, columnsVisibilityHandler, resetOrdering, resetColumnOrdering} = this.props;
    return (
      <div className="panel-group" id="table-filtering-accordion" role="tablist" aria-multiselectable="true">
        <div className="panel panel-default">
          <div className="panel-heading" role="tab" id="headingFiltering">
            <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFiltering" aria-expanded="false" aria-controls="collapseFiltering">
              <h4 className="panel-title">
               Table Filtering
              </h4>
            </a>
          </div>
          <div id="collapseFiltering" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFiltering">
            <div className="panel-body">
              <QueryInput onChange={filterHandler} query={table.getFilterExpression()} error={table.getFilterError()}/>
              <ColumnsVisibility columns={table.columns} onChange={columnsVisibilityHandler}/>
              <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
                <label className="control-label">Reset</label>
                <br/>
                <div className="row">
                  <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1">
                    <button type="button" className="btn btn-danger" onClick={resetOrdering}>
                      Ordering by value
                    </button>
                  </div>
                  <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1"></div>
                  <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1">
                    <button type="button" className="btn btn-danger" onClick={resetColumnOrdering}>
                      Column position
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default FilterView;

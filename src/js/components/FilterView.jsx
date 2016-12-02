import React from 'react';
import QueryInput from './QueryInput.jsx'
import ColumnsVisibility from './ColumnsVisibility.jsx'

class FilterView extends React.Component {
  constructor(props) {
    super(props);
  }


  componentWillMount()  {
    this.setState({query: this.props.table.getFilterExpression()});
  }

  mutateQuery(query) {
    this.setState({query});
  }

  applyQuery() {
    this.props.filterHandler(this.state.query);
  }



  render() {
    let {table, columnsVisibilityHandler, resetOrdering, resetColumnOrdering} = this.props;

    let {query} = this.state;

    return (
        <div className="panel-group" id="table-filtering-accordion"
             role="tablist" aria-multiselectable="true">
          <div className="panel panel-default">
            <div className="panel-heading" role="tab" id="headingFiltering">
              <a className="collapsed" role="button" data-toggle="collapse"
                 data-parent="#accordion" href="#collapseFiltering"
                 aria-expanded="false" aria-controls="collapseFiltering">
                <h4 className="panel-title">
                  Table Filtering
                </h4>
              </a>
            </div>
            <div id="collapseFiltering" className="panel-collapse collapse"
                 role="tabpanel" aria-labelledby="headingFiltering">
              <div className="panel-body">
                <QueryInput table={table}
                            onChange={(value) => this.mutateQuery(value)}
                            query={query}
                            error={table.getFilterError()}/>

                <div
                    className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
                  <div className="row">
                    <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1">
                      <button type="button" className="btn btn-success"
                              onClick={() => this.applyQuery()}>
                        Apply query
                      </button>
                    </div>
                  </div>
                </div>

                <ColumnsVisibility columns={table.columns}
                                   onChange={columnsVisibilityHandler}/>

                <div
                    className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
                  <label className="control-label">Reset</label>
                  <br/>
                  <div className="row">
                    <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1">
                      <button type="button" className="btn btn-danger"
                              onClick={resetOrdering}>
                        Ordering by value
                      </button>
                    </div>
                    <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1"></div>
                    <div className="col-sm-1 col-md-1 col-lg-1 col-xs-1">
                      <button type="button" className="btn btn-danger"
                              onClick={resetColumnOrdering}>
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

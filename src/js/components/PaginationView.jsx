import React from 'react'


class PaginationView extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPageCounter(table, handlePageSet) {
    let pages = []
    for (let counter = 1; counter < (table.getMaxPage() + 1); counter++) {
      pages.push((
          <li key={counter} className={counter === table.currentPage
              ? 'active'
              : ''}>
            <a onClick={() => handlePageSet(counter)}>{counter}
              <span className="sr-only"></span>
            </a>
          </li>
      ))
    }
    return pages;
  }

  static makeClassLine(classes, showSelect) {
    if (showSelect) {
      return classes;
    } else {
      return classes + " hidden";
    }
  }

  render() {
    let {
        table,
        handlePageSet,
        setPageSize,
        showSelect
    } = this.props;
    return (
        <div className="row">
          <div className={PaginationView.makeClassLine("col-sm-2 col-md-2 col-lg-2 col-xs-2", showSelect)}>
            <div className="form-group">
              <label htmlFor="table-page-size-selec">Page size:</label>
              <select
                  className="form-control"
                  id="table-page-size-select"
                  value={table.pageSize}
                  onChange={(evt) => {
                    setPageSize(evt.target.value)
                  }}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

          </div>

          <div className="col-sm-10 col-md-10 col-lg-10 col-xs-10">
            <nav aria-label="..." style={{paddingTop: '5px'}}>
              <ul className="pagination">
                <li className={table.currentPage === 1
                    ? 'disabled'
                    : ''}>
                  <a aria-label="Previous" onClick={() => handlePageSet(1)}>
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {this.renderPageCounter(table, handlePageSet)}
                <li className={table.currentPage < table.getMaxPage()
                    ? ''
                    : 'disabled'}>
                  <a aria-label="Next"
                     onClick={() => handlePageSet(table.getMaxPage())}>
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
    )
  };
}
export default PaginationView;

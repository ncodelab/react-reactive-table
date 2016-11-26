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
  render() {
    let {table, handlePageSet} = this.props;
    return (
      <nav aria-label="...">
        <ul className="pagination">
          <li className={table.currentPage === 1
            ? 'disabled'
            : ''}>
            <a aria-label="Previous" onClick={() => handlePageSet(1)}>
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {this.renderPageCounter(table, handlePageSet)}
          <li className={table.currentPage === table.getMaxPage()
            ? 'disabled'
            : ''}>
            <a aria-label="Next" onClick={() => handlePageSet(table.getMaxPage())}>
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    )
  };
}
export default PaginationView;

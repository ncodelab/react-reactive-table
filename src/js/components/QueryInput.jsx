import React from 'react';
import {queryToState} from './SimpleQueryInput.jsx';
import SimpleQueryInput from './SimpleQueryInput.jsx';

const selectedTab = {
  SIMPLE: 'simple-query',
  RAW: 'raw-query'
};


class QueryInput extends React.Component {
  constructor(props) {
    super(props);
  }

  updateState(item) {
    let {items, steps} = this.state.query;
    let newItems = items.slice();
    let newSteps = steps.slice();
    newSteps.push(this.state.step);
    newItems.push(item);
    let newValue = newItems.join(' ');
    this.setState({query: {value: newValue, items: newItems, steps: newSteps}});
    return newValue;
  }

  rewindStep(exportQuery) {
    let {items, steps} = this.state.query;
    if (steps.length > 0) {
      let newSteps = steps.slice();
      let newCurrentStep = newSteps.pop();
      let newItems = items.slice(0, items.length - 1);
      let newValue = newItems.join(' ');
      this.setState({
        step: steps[steps.length - 1],
        query: {value: newValue, items: newItems, steps: newSteps}
      });
      exportQuery(newValue);
    }
  }

  gotoStep(step) {
    this.setState({step});
  }

  static addErrorClass(base, error) {
    let classes = base;
    if (error) {
      classes = classes + ' has-error';
    } else {
      classes = classes + ' has-success';
    }
    return classes;
  }

  changeTab(tab) {
    if (tab === selectedTab.RAW) {
      this.props.onChange(this.state.query.value)
    }
    this.setState({tab});

  }

  componentWillMount() {
    let {query, step} = queryToState(this.props.query);
    this.setState({
      tab: selectedTab.SIMPLE,
      query,
      step
    });
  }

  handleRawQueryUpdate(queryText) {
    try {
      let {query, step} = queryToState(queryText);
      this.setState({
        query,
        step
      });
    } catch (e) {
    }

    this.props.onChange(queryText);
  }

  render() {

    let {onChange, query, error, table} = this.props;
    let hasError = !!error;

    let {tab, step, query:simpleQuery} = this.state;

    return (

        <div>

          <ul className="nav nav-tabs" role="tablist">
            <li role="presentation"
                className={tab === selectedTab.SIMPLE ? 'active' : ''}>
              <a onClick={(e) => this.changeTab(selectedTab.SIMPLE)} role="tab">Simple
                query</a>
            </li>
            <li role="presentation"
                className={tab === selectedTab.RAW ? 'active' : ''}>
              <a onClick={(e) => this.changeTab(selectedTab.RAW)} role="tab">Raw
                query</a>
            </li>
          </ul>

          <div className="tab-content">
            <div role="tabpanel"
                 className={tab === selectedTab.SIMPLE ? 'tab-pane active' : 'tab-pane'}>
              <br/>
              <SimpleQueryInput gotoStep={(step) => this.gotoStep(step)}
                                updateState={(item) => this.updateState(item)}
                                step={step}
                                rewindStep={() => this.rewindStep(onChange)}
                                query={simpleQuery}
                                table={table}
                                exportQuery={(value) => onChange(value)}/>
            </div>
            <div role="tabpanel"
                 className={tab === selectedTab.RAW ? 'tab-pane active' : 'tab-pane'}>
              <br/>
              <div
                  className={QueryInput.addErrorClass('form-group col-sm-12 col-md-12 col-lg-12 col-xs-12', hasError)}>
                <label htmlFor='tableViewFilterQuery'>Filter Query</label>
                <input
                    id='tableViewFilterQuery'
                    type='text'
                    className='form-control'
                    onChange={(evt) => this.handleRawQueryUpdate(evt.target.value)}
                    value={query}/>
              </div>
            </div>
          </div>

        </div>
    )
  }
}

export default QueryInput;

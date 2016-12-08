import React from 'react';
import {parser} from '../parser.jsx';
import {reduceAstToState} from  '../data/Filter.jsx';


export const queryToState = (query) => {
  if (query.trim() != '') {
    try {
      let ast = parser.parse(query);
      let tmpState = reduceAstToState(ast);
      return {
        step: step.LOGIC,
        query: {
          value: tmpState.items.join(' '),
          items: tmpState.items,
          steps: tmpState.steps
        }
      };
    } catch (e) {
    }
  } else {
    return {
      step: step.COLUMN,
      query: {value: '', items: [], steps: []}
    }
  }
};

export const step = {
  COLUMN: 'choose-column',
  ACTION: 'choose-action',
  VALUE: 'choose-value',
  LOGIC: 'chose-logic-actions'
};

export const actionType = {
  SIMPLE: 'simple',
  PARAM: 'param'
};

export const logicActions = {
  and: {
    view: '&&'
  },
  or: {
    view: '||'
  }
};

export const actions = {
  l: {
    view: '<',
    type: actionType.PARAM
  },
  lt: {
    view: '<=',
    type: actionType.PARAM
  },
  g: {
    view: '>',
    type: actionType.PARAM
  },
  gt: {
    view: '>=',
    type: actionType.PARAM
  },
  eq: {
    view: '=',
    type: actionType.PARAM
  },
  con: {
    view: '*',
    type: actionType.PARAM
  },
  exc: {
    view: '!',
    type: actionType.PARAM
  },
  st: {
    view: '{',
    type: actionType.PARAM
  },
  end: {
    view: '}',
    type: actionType.PARAM
  },
  empty: {
    view: '[empty]',
    type: actionType.SIMPLE
  },
  nonempty: {
    view: '[nonempty]',
    type: actionType.SIMPLE
  }

};

class SimpleQueryInput extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      manualValue: ''
    });
  }


  chooseColumn(columnName) {
    columnName = '"' + columnName + '"';
    this.props.updateState(columnName);
    this.props.gotoStep(step.ACTION);
  }

  chooseAction(action, exportQuery) {
    const newQuery = this.props.updateState(action.view);
    if (action.type === actionType.PARAM) {
      this.props.gotoStep(step.VALUE);
    } else if (action.type === actionType.SIMPLE) {
      exportQuery(newQuery);
      this.props.gotoStep(step.LOGIC);
    }
  }

  chooseValue(value, exportQuery) {
    this.setState({manualValue: ''});
    let result = '';
    if (value.value) {
      result = value.value;
    } else if (value.column) {
      result = '"' + value.column + '"';
    }

    if (result !== '') {
      const newQuery = this.props.updateState(result);
      exportQuery(newQuery);
      this.props.gotoStep(step.LOGIC);
    }
  }

  chooseLogic(logic) {
    this.props.updateState(logic);
    this.props.gotoStep(step.COLUMN);
  }

  renderChooseColumn(table, handler) {
    let columns = table.columns;
    return (
        <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
          <label className="control-label">Choose column</label>
          <br/>
          <div className="btn-group" role="group">
            {columns.map((column) => <button key={column.name} type="button"
                                             className="btn btn-default"
                                             onClick={(e) => handler(column.name)}>{column.name}</button>)}
          </div>
        </div>
    )
  }

  renderChooseAction(handler) {
    return (
        <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
          <label className="control-label">Choose operator</label>
          <br/>
          <div className="btn-group" role="group">
            {Object.keys(actions).map((key) => {
              const action = actions[key];
              return (
                  <button key={action.view} type="button"
                          className="btn btn-default"
                          onClick={(e) => handler(action)}>{action.view}</button>);
            })}
          </div>
        </div>)
  }

  renderChooseValue(table, handler) {
    let columns = table.columns;
    let {manualValue} = this.state;
    return (
        <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
          <label className="control-label">Input value</label>

          <div className="input-group">
            <input type="text" className="form-control"
                   value={manualValue}
                   onChange={(evt) => {
                     this.setState({manualValue: evt.target.value})
                   }}
                   placeholder=""/>
            <div className="input-group-btn ">
              <button className="btn btn-warning"
                      onClick={(evt) => {
                        let int = parseInt(manualValue);
                        if (!isNaN(int)) {
                          handler({
                            value: manualValue + ' min'
                          })
                        }
                      }}
                      type="button">Minutes
              </button>
              <button className="btn btn-success"
                      onClick={(evt) => handler({value: manualValue + ' min'})}
                      type="button">Ok
              </button>
            </div>
          </div>

          <label className="control-label">or choose column</label>
          <br/>
          <div className="btn-group" role="group">
            {columns.map((column) => <button key={column.name} type="button"
                                             className="btn btn-default"
                                             onClick={(e) => handler({column: column.name})}>{column.name}</button>)}
          </div>
          <br/>
        </div>
    )
  }

  renderChooseLogic(handler) {
    return (
        <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
          <label className="control-label">Choose logic operator</label>
          <br/>
          <div className="btn-group" role="group">
            {Object.keys(logicActions).map((key) => {
              const {view} = logicActions[key];
              return (
                  <button key={view} type="button"
                          className="btn btn-default"
                          onClick={(e) => handler(view)}>{view}</button>);
            })}
          </div>
        </div>)
  }

  renderNeededHelper(table, exportQuery) {
    let {step:currentStep} = this.props;

    switch (currentStep) {
      case step.ACTION:
        return this.renderChooseAction((act) => this.chooseAction(act, exportQuery));
      case step.COLUMN:
        return this.renderChooseColumn(table, (cn) => this.chooseColumn(cn));
      case step.VALUE:
        return this.renderChooseValue(table, (val) => this.chooseValue(val, exportQuery));
      case step.LOGIC:
        return this.renderChooseLogic((lo) => this.chooseLogic(lo))
    }
  }

  render() {

    let {table, exportQuery, query, rewindStep} = this.props;

    return (
        <div>
          <div className="form-group col-sm-12 col-md-12 col-lg-12 col-xs-12">
            <label className="control-label">Resulting query</label>
            <br/>

            <div className="input-group">
              <input type="text" disabled={true} className="form-control"
                     placeholder="" value={query.value}/>
              <span className="input-group-btn">
                <button className="btn btn-default"
                        disabled={query.items.length === 0}
                        onClick={() => rewindStep(exportQuery)}
                        type="button">Backspace</button>
              </span>
            </div>
          </div>
          {this.renderNeededHelper(table, exportQuery)}
        </div>
    )
  }
}

export default SimpleQueryInput;

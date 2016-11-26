import React from 'react';

class QueryInput extends React.Component {
  constructor(props) {
    super(props);
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

  render() {

    let {onChange, query, error} = this.props;
    let hasError = !!error;

    return (
      <div
        className={QueryInput.addErrorClass('form-group col-sm-12 col-md-12 col-lg-12 col-xs-12', hasError)}>
        <label htmlFor='tableViewFilterQuery'>Filter Query</label>
        <input
          id='tableViewFilterQuery'
          type='text'
          className='form-control'
          onChange={(evt) => onChange(evt.target.value)}
          value={query}/>
      </div>
    )
  }
}

export default QueryInput;

class Row {
  /**
   * @param key {String}
   * @param columns {Array.<Column>}
   * @param values {Array.<String>}
   */
  constructor(key, columns, values) {

    /**
     * @type {Array.<Column>}
     */
    this.columns = columns;


    /**
     * @type {{String, String}}
     */
    this.values = {};

    /**
     * @type {String}
     */
    this.key = key;

    columns.forEach(column => {
      this.values[column.name] = values[column.name]
    });
  }

  updateValue(columnName, newValue) {
    this.values[columnName] = newValue
  }

  /**
   * @param column {Column}
   * @returns String
   */
  getValue(column) {
    return this.getValueByColumnName(column.name)
  }


  /**
   * @param columnName {String}
   * @returns String
   */
  getValueByColumnName(columnName) {
    return this.values[columnName]
  }
}

export default Row;

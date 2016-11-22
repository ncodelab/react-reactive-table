class Column {
  constructor(name) {
    this.inFilterExpression = false;
    this.name = name;
    this.visibility = true;
  }

  setVisibility(visibility) {
    this.visibility = visibility;
  }

  setInFilterExpression(flag) {
    this.inFilterExpression = flag;
  }

}

export default Column;

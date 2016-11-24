import React from 'react'

const DEFAULT_LEFT = '8px';

class ColumnResizerView extends React.Component {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      width: '16px',
      height: '11px',
      cursor: 'col-resize',
      border: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      display: 'flex',
      position: 'relative',
      left: DEFAULT_LEFT,
      zIndex: '1'
    };

    this.imgStyle = {
      position: 'relative',
      top: '-9px',
      left: '-4px',
    }


  }

  componentWillMount() {
    this.setState({'drag': false});
  }

  updateState(drag, xPosition) {
    this.setState({drag, xPosition})
  }

  setXPosition(xPosition) {
    this.setState({xPosition})
  }

  generateStyles() {
    if (this.state.drag) {
      this.defaultStyle['position'] = 'fixed';
      this.defaultStyle['left'] = this.state.xPosition;
    } else {
      this.defaultStyle['position'] = 'relative';
      this.defaultStyle['left'] = DEFAULT_LEFT;
    }

    return Object.assign({}, this.defaultStyle);
  }

  render() {

    let {handleWidthChange} = this.props;

    return (<th
        style={this.generateStyles()}
        onDragStart={(e) => {
          this.updateState(true, e.clientX - 14);
        }}
        onDragEnd={(e) => {
          this.updateState(false, e.clientX - 14);
        }}
        onDrag={(e) => {
          if (this.state.drag && e.clientX !== 0) {
            this.setXPosition(e.clientX);
            handleWidthChange(e.clientX, this.state.xPosition);
          }
        }}>
      <img style={this.imgStyle} width="25" height="12" title="" alt=""
           src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsYDjAk0TYAawAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAT0lEQVQ4y7XUSwoAIAhFUe/+F12DIIIIfz0HkTo4BSK2Ypgu4EgUEPsQQVyXzxDP5BOEW2hChItFiHQjCVFuBiFaLwhAWPebDoRwS+SnbgKAYwwLsTvjuQAAAABJRU5ErkJggg=="/>
    </th>);
  };
}

export default ColumnResizerView;

import React from 'react';
import ActiveRenderer from './virtualized/ActiveRenderer';

class Cell extends React.PureComponent {
  componentDidMount() {
    if (this.props.active) {
      this.anchor.focus();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.active && prevProps.active !== this.props.active) {
      this.anchor.focus();
    }
  }

  render() {
    const { active } = this.props;

    return <a href="#" ref={a => (this.anchor = a)}>{this.props.children}</a>;
  }
}

export default class CellRenderer extends ActiveRenderer {
  renderer = ({ columnIndex, key, rowIndex, style }) => {
    const borderColor = this.isCellActive(rowIndex, columnIndex) ? 'red' : 'blue';
    return (
      <div
        onClick={() => this.onScrollToChange({ scrollToColumn: columnIndex, scrollToRow: rowIndex })}
        key={key}
        style={{
          ...style,
          boxSizing: 'border-box',
          border: '5px solid',
          borderColor,
        }}
      >
        <Cell active={this.isCellActive(rowIndex, columnIndex)}>{key}</Cell>
      </div>
    )
  };
}

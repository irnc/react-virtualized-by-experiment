import React from 'react';
import ActiveRenderer from './virtualized/ActiveRenderer';

export default class RowRenderer extends ActiveRenderer {
  renderer = ({ index, key, style }) => {
    const borderColor = (index === this.state.scrollToRow) ? 'red' : 'blue';

    let text = key;
    if (this.props.list) {
      text = `${key} - ${this.props.list[index]}`;
    }

    return (
      <div
        onClick={() => this.onScrollToChange({ scrollToColumn: 1, scrollToRow: index })}
        key={key}
        style={{
          ...style,
          boxSizing: 'border-box',
          border: '5px solid',
          borderColor,
        }}
      >
        {text}
      </div>
    );
  }
}

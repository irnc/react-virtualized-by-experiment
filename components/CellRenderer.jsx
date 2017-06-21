import React from 'react';
import ActiveRenderer from './virtualized/ActiveRenderer';

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
        {key}
      </div>
    )
  };
}

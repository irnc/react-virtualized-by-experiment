import React from 'react';
import ActiveRenderer from './virtualized/ActiveRenderer';
import VideoList from './VideoList';

export default class ChannelRenderer extends ActiveRenderer {
  renderer = ({ index, key, style }) => {
    const isChannelActive = index === this.state.scrollToRow;
    const borderColor = isChannelActive ? 'red' : 'blue';

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
        <VideoList channelId={index} isChannelActive={isChannelActive} />
      </div>
    );
  }
}

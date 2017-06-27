import React from 'react';
import ActiveRenderer from './virtualized/ActiveRenderer';

class Video extends React.PureComponent {
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

export default class VideoRenderer extends ActiveRenderer {
  renderer = ({ columnIndex, key, rowIndex, style }) => {
    const isVideoActive = this.props.isChannelActive && this.isCellActive(rowIndex, columnIndex);
    const borderColor = isVideoActive ? 'red' : 'blue';
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
        <Video active={isVideoActive}>
          Channel ID: {this.props.channelId},
          Key: {key}
        </Video>
      </div>
    )
  };
}

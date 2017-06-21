import React from 'react';

export default class ActiveRenderer extends React.Component {
  state = {
    scrollToRow: 0,
    scrollToColumn: 0,
    scrollToAlignment: 'auto',
  }

  // Could be called on partial options, e.g. scrollToColumn omited
  onScrollToChange = ({ scrollToColumn, scrollToRow, scrollToAlignment }) => {
    if (scrollToColumn !== undefined) {
      this.setState({ scrollToColumn });
    }

    if (scrollToRow !== undefined) {
      this.setState({ scrollToRow });
    }

    this.setState({
      // scrollToAlignment would be undefined when called from onScrollToChange
      // of ArrowKeyStepper. In that case we navigate on one page, i.e.
      // alignment should be auto.
      scrollToAlignment: scrollToAlignment || 'auto',
    });
  }

  isCellActive(rowIndex: number, columnIndex: number) {
    const { scrollToRow, scrollToColumn } = this.state;
    return rowIndex === scrollToRow && columnIndex === scrollToColumn;
  }

  render() {
    const { onScrollToChange, renderer } = this;
    const { scrollToColumn, scrollToRow, scrollToAlignment } = this.state;
    return this.props.children({
      onScrollToChange,
      renderer,
      scrollToColumn,
      scrollToRow,
      scrollToAlignment,
    });
  }
}

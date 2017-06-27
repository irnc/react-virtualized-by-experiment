import React from 'react';

export default class RemoteListContainer extends React.Component {
  state = {
    list: [],
    rowCount: 100,
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(`loadMoreRows ${startIndex}, ${stopIndex}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = Array.from(this.state.list);
        for (let i = startIndex; i <= stopIndex; i++) {
          list[i] = Math.random();
        }

        if (this.mounted) {
          this.setState({ list });

          if (this.state.rowCount === 0) {
            this.setState({ rowCount: 100 });
          }
        }
        resolve();
      }, 2000);
    })
  }

  render() {
    const { isRowLoaded, loadMoreRows } = this;
    const { rowCount, list } = this.state;
    return this.props.children({ isRowLoaded, loadMoreRows, rowCount, list });
  }
}

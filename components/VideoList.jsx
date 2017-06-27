import React from 'react';
import { Grid, ArrowKeyStepper, List, InfiniteLoader } from 'react-virtualized';

import PageStepper from './virtualized/PageStepper';
import { scrollToPreviousPage, scrollToNextPage } from './virtualized/FixedPageView';
import VideoRenderer from './VideoRenderer';
import RemoteListContainer from './RemoteListContainer';

export default (props) => {
  // We intend to show a horizontal list. There is no support for horizontal
  // List in react-virtualized, as its List works with rows. So to visually
  // represent a horizontal list we would use Grid with rowCount set to 1,
  // and columnCount set to a number of rows in our data.
  //
  // Note confusing in term names, that rows of data are displayed as columns
  // of a Grid.
  const visualRowCount = 1; // will be used to restrain Grid to one row
  const pageSize = 5; // how many cells would be shown per fixed page
  const rowHeight = 100;
  const gridHeight = rowHeight * pageSize;
  const { channelId, isChannelActive } = props;

  return (
    <RemoteListContainer>
      {({ isRowLoaded, loadMoreRows, rowCount: dataRowCount, list }) => (
        // InfiniteLoader works with data rows.
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={dataRowCount}
          threshold={pageSize}
          minimumBatchSize={pageSize}
        >
          {({ onRowsRendered: infiniteLoader$onRowsRendered, registerChild }) => (
            // cellRenderer passed to Grid below should render active cell distinctly
            <VideoRenderer list={list} channelId={channelId} isChannelActive={isChannelActive}>
              {/*
                CellRenderer should track active cell, so it should be
                notified of each scroll-to action, thus it passes down
                onScrollToChange callback */}
              {({ renderer, scrollToColumn, scrollToRow, scrollToAlignment, onScrollToChange }) => (
                <PageStepper
                  rowCount={dataRowCount}
                  onScrollToChange={onScrollToChange}
                  pageSize={pageSize}
                  scrollToRow={scrollToRow}
                  scrollToPreviousPage={scrollToPreviousPage}
                  scrollToNextPage={scrollToNextPage}
                >
                  {/*
                    ArrowKeyStepper is inherently visual component, it scrolls
                    to row on Up/Down arrows, and columns on Left/Right.
                    */}
                  <ArrowKeyStepper
                    rowCount={visualRowCount}
                    columnCount={dataRowCount}
                    mode="cells"
                    isControlled
                    // Arrow events bubbled to ArrowKeyStepper's div will
                    // call onScrollToChange callback. Browser default would
                    // be prevented, i.e. no auto scroll.
                    onScrollToChange={onScrollToChange}
                    scrollToColumn={scrollToColumn}
                    scrollToRow={scrollToRow}
                  >
                    {/*
                      onSectionRendered updates internal properties of
                      ArrowKeyStepper instance, which are used only in edges
                      mode. In our case we could omit call to it.
                      */}
                    {({ scrollToRow, scrollToColumn /*, onSectionRendered */ }) => (
                      <Grid
                        // required Grid props
                        width={500}
                        height={gridHeight}
                        columnCount={dataRowCount}
                        columnWidth={150}
                        rowHeight={rowHeight}
                        rowCount={visualRowCount}
                        cellRenderer={renderer}
                        // We don't use row indeces because it is one row
                        // grid.
                        onSectionRendered={({ columnStartIndex, columnStopIndex }) => {
                          // call back InfiniteLoader
                          infiniteLoader$onRowsRendered({
                            startIndex: columnStartIndex,
                            stopIndex: columnStopIndex
                          });
                        }}
                        scrollToRow={scrollToRow}
                        scrollToColumn={scrollToColumn}
                        scrollToAlignment={scrollToAlignment}

                        // register child for InfiniteLoader
                        ref={registerChild}
                      >
                      </Grid>
                    )}
                  </ArrowKeyStepper>
                </PageStepper>
              )}
            </VideoRenderer>
          )}
        </InfiniteLoader>
      )}
    </RemoteListContainer>
  );
};

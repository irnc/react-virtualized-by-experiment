import React from 'react';
import { Grid, ArrowKeyStepper, List, InfiniteLoader } from 'react-virtualized';

import PageStepper from './virtualized/PageStepper';
import { scrollToPreviousPage, scrollToNextPage } from './virtualized/FixedPageView';
import ChannelRenderer from './ChannelRenderer';
import RemoteListContainer from './RemoteListContainer';

// TwoDimensionUnsyncList
/*
  Example below is created to show YouTube channels as rows, where each row
  contains videos from the channel.

  There could be a lot of channels, and a lot of videos, so we use
  InfiniteLoader to load them in chunks.
 */
export default () => {
  // Counts are provided from above.
  const columnCount = 1;
  const pageSize = 6;
  const rowHeight = 100;
  const gridHeight = rowHeight * pageSize;

  return (
    <RemoteListContainer>
      {({ isRowLoaded, loadMoreRows, rowCount, list }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={rowCount}
          threshold={pageSize}
          minimumBatchSize={pageSize}
        >
          {({ onRowsRendered: notifyLoaderOnRowsRendered, registerChild }) => (
            <ChannelRenderer list={list}>
              {({ onScrollToChange, renderer, scrollToColumn, scrollToRow, scrollToAlignment }) => (
                <PageStepper
                  rowCount={rowCount}
                  onScrollToChange={onScrollToChange}
                  pageSize={pageSize}
                  scrollToRow={scrollToRow}
                  scrollToPreviousPage={scrollToPreviousPage}
                  scrollToNextPage={scrollToNextPage}
                >
                  <ArrowKeyStepper
                    columnCount={columnCount}
                    rowCount={rowCount}
                    mode="cells"
                    isControlled={true}
                    onScrollToChange={onScrollToChange}
                    scrollToColumn={scrollToColumn}
                    scrollToRow={scrollToRow}
                  >
                    {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
                      <List
                        // required Grid props
                        width={500}
                        height={gridHeight}
                        rowHeight={rowHeight}
                        rowCount={rowCount}
                        rowRenderer={renderer}
                        // required to be passed for ArrowKeyStepper to work
                        onRowsRendered={({ startIndex, stopIndex }) => {
                          console.log(`onRowsRendered ${startIndex}, ${stopIndex}`)
                          notifyLoaderOnRowsRendered({ startIndex, stopIndex });
                          onSectionRendered({
                            columnStartIndex: 1,
                            columnStopIndex: 1,
                            rowStartIndex: startIndex,
                            rowStopIndex: stopIndex,
                          });
                        }}
                        scrollToIndex={scrollToRow}
                        scrollToAlignment={scrollToAlignment}

                        // register child for InfiniteLoader
                        ref={registerChild}
                      >
                      </List>
                    )}
                  </ArrowKeyStepper>
                </PageStepper>
              )}
            </ChannelRenderer>
          )}
        </InfiniteLoader>
      )}
    </RemoteListContainer>
  );
};

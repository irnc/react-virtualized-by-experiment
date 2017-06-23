import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from '@storybook/addon-knobs';
import { Grid, ArrowKeyStepper, List, InfiniteLoader } from 'react-virtualized';
import ActiveRenderer from '../components/virtualized/ActiveRenderer';
import PageStepper from '../components/virtualized/PageStepper';
import CellRenderer from '../components/CellRenderer';
import Button from './Button';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

function cellRenderer ({ columnIndex, key, rowIndex, style }) {
  return (
    <div
      key={key}
      style={{
        ...style,
        boxSizing: 'border-box',
        border: '1px solid red',
      }}
    >
      {key}
    </div>
  )
}

class ActiveRowRenderer extends ActiveRenderer {
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

const scrollToPreviousPage = ({ pageSize, activeRow }) => {
  const adjustment = (activeRow % pageSize) + 1;

  return {
    scrollToRow: Math.max(0, activeRow - adjustment),
    scrollToAlignment: 'end',
  };
};

const scrollToNextPage = ({ rowCount, pageSize, activeRow }) => {
  const adjustment = pageSize - (activeRow % pageSize);

  return {
    scrollToRow: Math.min(activeRow + adjustment, rowCount - 1),
    scrollToAlignment: 'start',
  };
};

storiesOf('Grid', module)
  .add('with list of one item', () => (
    <Grid
      width={500}
      columnWidth={250}
      height={200}
      rowHeight={100}
      columnCount={1}
      rowCount={1}
      cellRenderer={cellRenderer}
    >
    </Grid>
  ))
  .add('with list of two items', () => (
    <Grid
      width={500}
      columnWidth={250}
      height={200}
      rowHeight={100}
      columnCount={1}
      rowCount={2}
      cellRenderer={cellRenderer}
    >
    </Grid>
  ))
  // Note how it uses native scroll
  .add('with list of ten items', () => (
    <Grid
      width={500}
      columnWidth={250}
      height={200}
      rowHeight={100}
      columnCount={1}
      rowCount={10}
      cellRenderer={cellRenderer}
    >
    </Grid>
  ))
  .add('with hidden scrollbar (WIP)', () => (
    // It is not possible to hide scrollbar using overflow on container style,
    // as it is Grid who adds scroll, not internal container.
    //
    // - `containerStyle={{ overflow: 'hidden' }}` doesn't work
    //
    // ::-webkit-scrollbar { display: none } may work, but we couldn't style
    // pseaudo-elements using style prop. Instead we should try
    // styled-components wrapping or a custom className.
    <Grid
      width={500}
      columnWidth={250}
      height={200}
      rowHeight={100}
      columnCount={1}
      rowCount={10}
      cellRenderer={cellRenderer}
    >
    </Grid>
  ))
  .addDecorator(withKnobs)
  .add('with ArrowKeyStepper', () => {
    // Counts are provided from above.
    const columnCount = 1;
    const rowCount = 10;
    const simultaneouslyVisibleRows = 3;
    const rowHeight = 100;
    const gridHeight = rowHeight * simultaneouslyVisibleRows;

    const label = 'mode';
    const options = {
      edges: 'edges',
      // Note how cells mode allow navigation on visible cells without moving
      // visible window.
      cells: 'cells',
    };
    // edges mode is default in ArrowKeyStepper
    const defaultValue = 'edges';

    return (
      <ArrowKeyStepper
        columnCount={columnCount}
        rowCount={rowCount}
        mode={select(label, options, defaultValue)}
      >
        {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
          <Grid
            // required Grid props
            width={500}
            columnWidth={250}
            height={gridHeight}
            rowHeight={rowHeight}
            columnCount={columnCount}
            rowCount={rowCount}
            cellRenderer={cellRenderer}
            // required to be passed for ArrowKeyStepper to work
            onSectionRendered={onSectionRendered}
            scrollToColumn={scrollToColumn}
            scrollToRow={scrollToRow}
          >
          </Grid>
        )}
      </ArrowKeyStepper>
    );
  })
  .add('with active cell tracking', () => {
    // Counts are provided from above.
    const columnCount = 1;
    const rowCount = 10;
    const simultaneouslyVisibleRows = 3;
    const rowHeight = 100;
    const gridHeight = rowHeight * simultaneouslyVisibleRows;

    return (
      <CellRenderer>
        {({ onActiveCellToChange, renderer, scrollToColumn, scrollToRow }) => (
          <ArrowKeyStepper
            columnCount={columnCount}
            rowCount={rowCount}
            mode="cells"
            isControlled={true}
            onScrollToChange={onActiveCellToChange}
            scrollToColumn={scrollToColumn}
            scrollToRow={scrollToRow}
          >
            {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
              <Grid
                // required Grid props
                width={500}
                columnWidth={250}
                height={gridHeight}
                rowHeight={rowHeight}
                columnCount={columnCount}
                rowCount={rowCount}
                cellRenderer={renderer}
                // required to be passed for ArrowKeyStepper to work
                onSectionRendered={onSectionRendered}
                scrollToColumn={scrollToColumn}
                scrollToRow={scrollToRow}
              >
              </Grid>
            )}
          </ArrowKeyStepper>
        )}
      </CellRenderer>
    );
  })
  .add('with page stepper', () => {
    // Counts are provided from above.
    const columnCount = 1;
    const rowCount = 10;
    const pageSize = 3;
    const rowHeight = 100;
    const gridHeight = rowHeight * pageSize;

    return (
      <CellRenderer>
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
                <Grid
                  // required Grid props
                  width={500}
                  columnWidth={250}
                  height={gridHeight}
                  rowHeight={rowHeight}
                  columnCount={columnCount}
                  rowCount={rowCount}
                  cellRenderer={renderer}
                  // required to be passed for ArrowKeyStepper to work
                  onSectionRendered={onSectionRendered}
                  scrollToColumn={scrollToColumn}
                  scrollToRow={scrollToRow}
                  scrollToAlignment={scrollToAlignment}
                >
                </Grid>
              )}
            </ArrowKeyStepper>
          </PageStepper>
        )}
      </CellRenderer>
    );
  })
  .add('with steppers on a List', () => {
    // Counts are provided from above.
    const columnCount = 1;
    const rowCount = 10;
    const pageSize = 3;
    const rowHeight = 100;
    const gridHeight = rowHeight * pageSize;

    return (
      <ActiveRowRenderer>
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
                    onSectionRendered({
                      columnStartIndex: 1,
                      columnStopIndex: 1,
                      rowStartIndex: startIndex,
                      rowStopIndex: stopIndex,
                    });
                  }}
                  scrollToIndex={scrollToRow}
                  scrollToAlignment={scrollToAlignment}
                >
                </List>
              )}
            </ArrowKeyStepper>
          </PageStepper>
        )}
      </ActiveRowRenderer>
    );
  })
  .add('with infinite loader', () => {
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
              <ActiveRowRenderer list={list}>
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
              </ActiveRowRenderer>
            )}
          </InfiniteLoader>
        )}
      </RemoteListContainer>
    );
  })
  .add('with infinite loader on horizontal list', () => {
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
              <CellRenderer list={list}>
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
              </CellRenderer>
            )}
          </InfiniteLoader>
        )}
      </RemoteListContainer>
    );
  });

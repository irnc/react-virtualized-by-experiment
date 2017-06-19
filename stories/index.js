import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, select } from '@storybook/addon-knobs';
import { Grid, ArrowKeyStepper } from 'react-virtualized';
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

class ActiveCellRenderer extends React.Component {
  state = {
    scrollToRow: 0,
    scrollToColumn: 0,
    scrollToAlignment: 'auto',
  }

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const borderColor = (rowIndex === this.state.scrollToRow) ? 'red' : 'blue';
    return (
      <div
        onClick={() => this.onActiveCellToChange({ scrollToColumn: columnIndex, scrollToRow: rowIndex })}
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
  }

  onActiveCellToChange = ({ scrollToColumn, scrollToRow, scrollToAlignment }) => {
    this.setState({
      // Reuse current column if it isn't set.
      scrollToColumn: scrollToColumn || this.state.scrollToColumn,
      scrollToRow,
      // scrollToAlignment would be undefined when called from onScrollToChange
      // of ArrowKeyStepper. In that case we navigate on one page, i.e.
      // alignment should be auto.
      scrollToAlignment: scrollToAlignment || 'auto',
    });
  }

  render() {
    const { onActiveCellToChange, cellRenderer } = this;
    const { scrollToColumn, scrollToRow, scrollToAlignment } = this.state;
    return this.props.children({
      onActiveCellToChange,
      cellRenderer,
      scrollToColumn,
      scrollToRow,
      scrollToAlignment,
    });
  }
}

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
      <ActiveCellRenderer>
        {({ onActiveCellToChange, cellRenderer, scrollToColumn, scrollToRow }) => (
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
                cellRenderer={cellRenderer}
                // required to be passed for ArrowKeyStepper to work
                onSectionRendered={onSectionRendered}
                scrollToColumn={scrollToColumn}
                scrollToRow={scrollToRow}
              >
              </Grid>
            )}
          </ArrowKeyStepper>
        )}
      </ActiveCellRenderer>
    );
  })
  .add('with page stepper', () => {
    // Counts are provided from above.
    const columnCount = 1;
    const rowCount = 10;
    const simultaneouslyVisibleRows = 3;
    const rowHeight = 100;
    const gridHeight = rowHeight * simultaneouslyVisibleRows;

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


    function PageStepper({
      onScrollToChange,
      rowCount,
      scrollToRow,
      children,
      scrollToPreviousPage,
      scrollToNextPage,
    }) {
      // TODO receive step from props
      const step = 3;
      const onKeyDown = (event) => {
        switch (event.key) {
          case 'PageUp':
            event.preventDefault();
            onScrollToChange(scrollToPreviousPage({ pageSize: step, activeRow: scrollToRow }));
            break;

          case 'PageDown':
            event.preventDefault();
            onScrollToChange(scrollToNextPage({ rowCount, pageSize: step, activeRow: scrollToRow }));
            break;
        }
      };

      return (
        <div onKeyDown={onKeyDown}>{children}</div>
      );
    }

    return (
      <ActiveCellRenderer>
        {({ onActiveCellToChange, cellRenderer, scrollToColumn, scrollToRow, scrollToAlignment }) => (
          <PageStepper
            rowCount={rowCount}
            onScrollToChange={onActiveCellToChange}
            scrollToRow={scrollToRow}
            scrollToPreviousPage={scrollToPreviousPage}
            scrollToNextPage={scrollToNextPage}
          >
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
                  cellRenderer={cellRenderer}
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
      </ActiveCellRenderer>
    );
  });

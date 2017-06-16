import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
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
  .add('with ArrowKeyStepper', () => {
    // Counts are provided from above.
    const columnCount = 1;
    const rowCount = 10;
    const simultaneouslyVisibleRows = 3;
    const rowHeight = 100;
    const gridHeight = rowHeight * simultaneouslyVisibleRows;

    return (
      <ArrowKeyStepper
        columnCount={columnCount}
        rowCount={rowCount}
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
  });

import React from 'react';

type Props = {
  /*
  Number of data rows in collection. Will be passed to custom scrollToNextPage,
  which may update scroll only after check that next page exists.
  */
  rowCount: number,
};

function PageStepper({
  onScrollToChange,
  rowCount,
  pageSize,
  scrollToRow,
  children,
  scrollToPreviousPage,
  scrollToNextPage,
}: Props) {
  const switchToPreviousPage = () => {
    onScrollToChange(scrollToPreviousPage({ pageSize, activeRow: scrollToRow }));
  };
  const switchToNextPage = () => {
    onScrollToChange(scrollToNextPage({ rowCount, pageSize, activeRow: scrollToRow }));
  };
  const onKeyDown = (event) => {
    console.log(`PageStepper, ${event.key}`, event.target);
    switch (event.key) {
      case 'PageUp':
        event.preventDefault();
        switchToPreviousPage();
        break;

      case 'PageDown':
        event.preventDefault();
        switchToNextPage();
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (scrollToRow % pageSize === 0) {
          switchToPreviousPage();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (scrollToRow % pageSize === (pageSize - 1)) {
          switchToNextPage();
        }
        break;
    }
  };

  return (
    <div onKeyDown={onKeyDown}>{children}</div>
  );
}

export default PageStepper;

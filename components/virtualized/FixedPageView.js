export const scrollToPreviousPage = ({ pageSize, activeRow }) => {
  const adjustment = (activeRow % pageSize) + 1;

  return {
    scrollToRow: Math.max(0, activeRow - adjustment),
    scrollToAlignment: 'end',
  };
};

export const scrollToNextPage = ({ rowCount, pageSize, activeRow }) => {
  const adjustment = pageSize - (activeRow % pageSize);

  return {
    scrollToRow: Math.min(activeRow + adjustment, rowCount - 1),
    scrollToAlignment: 'start',
  };
};

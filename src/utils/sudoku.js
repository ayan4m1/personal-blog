export function checkSolution(puzzle, values, solution) {
  if (!puzzle.length) {
    return false;
  }

  const currentBoard = puzzle
    .map((boardRow, rowIdx) =>
      boardRow
        .map((value, colIdx) => {
          if (value !== null) {
            return value.toString();
          }

          const liveValue = values[rowIdx][colIdx];

          return liveValue === -1 ? '-' : liveValue;
        })
        .join('')
    )
    .join('');

  return currentBoard === solution;
}

export function getInvalids(values, rows) {
  return values.map((row, rowIdx) =>
    row.map((value, colIdx) => {
      if (value === -1) {
        return true;
      }

      const targetRow = rows[rowIdx];

      if (
        ((targetRow &&
          targetRow.indexOf(value) === colIdx &&
          targetRow.lastIndexOf(value) === colIdx) ||
          (targetRow.indexOf(value) === -1 &&
            targetRow.lastIndexOf(value) === -1) ||
          row.indexOf(value) !== colIdx ||
          row.lastIndexOf(value) !== colIdx) &&
        rows.every((searchRow) => searchRow[colIdx] !== value)
      ) {
        const cellRow = Math.floor(rowIdx / 3);
        const cellCol = Math.floor(colIdx / 3);

        for (
          let searchRowIdx = cellRow * 3;
          searchRowIdx < (cellRow + 1) * 3;
          searchRowIdx++
        ) {
          for (
            let searchColIdx = cellCol * 3;
            searchColIdx < (cellCol + 1) * 3;
            searchColIdx++
          ) {
            if (
              searchRowIdx !== rowIdx &&
              searchColIdx !== colIdx &&
              (rows[searchRowIdx][searchColIdx] === value ||
                values[searchRowIdx][searchColIdx] === value)
            ) {
              return false;
            }
          }
        }

        return true;
      } else {
        return false;
      }
    })
  );
}

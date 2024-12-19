import React from 'react';
import './Grid.css';

function Grid({ grid, highlightedRow, highlightedColumn, activeCell, handleKeyPress, handleCellClick, cellRefs }) {
  return (
    <div className="grid">
      {grid.map((letter, index) => {
        const rowIndex = Math.floor(index / 4);
        const colIndex = index % 4;
        const isHighlightedRow = highlightedRow === rowIndex;
        const isHighlightedColumn = highlightedColumn === colIndex;
        const isActiveCell = activeCell === index;

        const cellClassNames = [
          "grid-cell",
          isHighlightedRow && "highlighted",
          isHighlightedColumn && "highlighted",
          isActiveCell && "active-cell",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={index}
            ref={cellRefs[index]} // Add ref to each cell
            className={cellClassNames}
            tabIndex={0}
            onClick={() => handleCellClick(index)}
            onKeyDown={(e) => handleKeyPress(index, e)}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}

export default Grid;
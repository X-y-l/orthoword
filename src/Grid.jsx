import React, { useState, useEffect } from 'react';
import './Grid.css';

function Grid({ grid, highlightedRow, highlightedColumn, activeCell, handleKeyPress, handleCellClick, cellRefs }) {
  const [isSolved, setIsSolved] = useState(false);
  const solutions = ["FLAPIOTASNOWHEMS", "FISHLONEATOMPAWS"];

  useEffect(() => {
    if (solutions.includes(grid.join(""))) {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
  }, [grid]);

  // Handle focus when tabbing
  const handleFocus = (index, event) => {
    // Only handle focus if it's from keyboard navigation (tab)
    if (event.relatedTarget) {
      const rowIndex = Math.floor(index / 4);
      const colIndex = index % 4;
      
      // If there's already an active cell, maintain the current highlighting orientation
      if (activeCell !== null) {
        if (highlightedRow !== null) {
          handleCellClick(index);
        } else if (highlightedColumn !== null) {
          handleCellClick(index);
        }
      } else {
        // Default to row highlighting if no current orientation
        handleCellClick(index);
      }
    }
  };

  // Handle mousedown to prevent losing selection when dragging
  const handleMouseDown = (index, event) => {
    event.preventDefault(); // Prevent text selection
    handleCellClick(index);
  };

  return (
    <div className="grid-container">
      {isSolved && (
        <div className="success-message">
          🎉 Congratulations! You've solved the puzzle! 🎉
        </div>
      )}

      <div className={`grid ${isSolved ? "solved-grid" : ""}`}>
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
            isSolved && "correct-cell",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={index}
              ref={cellRefs[index]}
              className={cellClassNames}
              tabIndex={0}
              onMouseDown={(e) => handleMouseDown(index, e)}
              onFocus={(e) => handleFocus(index, e)}
              onKeyDown={(e) => handleKeyPress(index, e)}
            >
              {letter}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Grid;
import React, { useState, useRef } from 'react';
import './App.css';
import Grid from './Grid';
import HintsPanel from './HintsPanel';

function App() {
  const [grid, setGrid] = useState(Array(16).fill(""));
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [highlightedColumn, setHighlightedColumn] = useState(null);
  const [highlightingOrientation, setHighlightingOrientation] = useState('row');
  const [activeCell, setActiveCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hints = [
    "Wave wings",
    "Furry feet",
    "Greek glyph",
    "Scaled swimmer",
    "Singular soul",
    "Skirts outskirts",
    "Winter weather",
    "Indivisible item"
  ];
  
  const cellRefs = Array.from({ length: 16 }, () => useRef(null));

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleKeyPress = (index, event) => {
    const letter = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      const newGrid = [...grid];
      newGrid[index] = letter;
      setGrid(newGrid);

      let nextCell = null;

      if (highlightingOrientation === 'row') {
        nextCell = index % 4 !== 3 ? index + 1 : null;
      } else if (highlightingOrientation === 'column') {
        nextCell = index < 12 ? index + 4 : null;
      }

      if (nextCell !== null) {
        setActiveCell(nextCell);
        cellRefs[nextCell].current.focus();
      }
    }
  };

  const handleCellClick = (index) => {
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;

    if (activeCell === index) {
      setHighlightingOrientation(prev =>
        prev === 'row' ? 'column' : 'row'
      );

      if (highlightingOrientation === 'row') {
        setHighlightedRow(null);
        setHighlightedColumn(colIndex);
      } else {
        setHighlightedColumn(null);
        setHighlightedRow(rowIndex);
      }
    } else {
      if (highlightingOrientation === 'row') {
        setHighlightedRow(rowIndex);
        setHighlightedColumn(null);
      } else {
        setHighlightedColumn(colIndex);
        setHighlightedRow(null);
      }
    }

    setActiveCell(index);
    cellRefs[index].current.focus();
  };

  const handleKeyDown = (e) => {
    // Check if the active element is an input or textarea
    const activeElement = document.activeElement;
    const isInputActive = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA' ||
                         activeElement.isContentEditable;

    // If we're in an input element, don't handle the keyboard events
    if (isInputActive) {
      return;
    }

    if (!activeCell && activeCell !== 0) return;

    // Space key handling
    if (e.key === " ") {
      e.preventDefault(); // Prevent scrolling
      setHighlightingOrientation(prev =>
        prev === 'row' ? 'column' : 'row'
      );

      if (highlightingOrientation === 'row') {
        const currentCol = activeCell % 4;
        setHighlightedRow(null);
        setHighlightedColumn(currentCol);
      } else {
        const currentRow = Math.floor(activeCell / 4);
        setHighlightedColumn(null);
        setHighlightedRow(currentRow);
      }

      return;
    }

    if (e.key === "Enter") {
      let newIndex = null;

      const currentRow = Math.floor(activeCell / 4);
      const currentCol = activeCell % 4;

      if (highlightingOrientation === 'row') {
        newIndex = (currentRow < 3) ? activeCell + 4 - currentCol : 0;
      } else if (highlightingOrientation === 'column') {
        newIndex = (currentCol < 3) ? activeCell + 1 - 4 * currentRow : 0;
      }

      if (newIndex !== null) {
        setActiveCell(newIndex);
        cellRefs[newIndex].current.focus();

        const newRow = Math.floor(newIndex / 4);
        const newCol = newIndex % 4;

        if (highlightingOrientation === 'row') {
          setHighlightedRow(newRow);
          setHighlightedColumn(null);
        } else {
          setHighlightedColumn(newCol);
          setHighlightedRow(null);
        }
      }

      return;
    }

    // Delete key handling
    if (e.key === "Backspace" || e.key === "Delete") {
      const newGrid = [...grid];
      newGrid[activeCell] = "";
      setGrid(newGrid);

      let previousCell = null;

      if (highlightingOrientation === 'row') {
        previousCell = activeCell % 4 !== 0 ? activeCell - 1 : null;
      } else if (highlightingOrientation === 'column') {
        previousCell = activeCell >= 4 ? activeCell - 4 : null;
      }

      if (previousCell !== null) {
        setActiveCell(previousCell);
        cellRefs[previousCell].current.focus();

        const newRow = Math.floor(previousCell / 4);
        const newCol = previousCell % 4;

        if (highlightingOrientation === 'row') {
          setHighlightedRow(newRow);
          setHighlightedColumn(null);
        } else {
          setHighlightedColumn(newCol);
          setHighlightedRow(null);
        }
      }

      return;
    }

    const currentRow = Math.floor(activeCell / 4);
    const currentCol = activeCell % 4;
    let newIndex = activeCell;

    switch (e.key) {
      case "ArrowUp":
        newIndex = currentRow > 0 ? activeCell - 4 : activeCell;
        break;
      case "ArrowDown":
        newIndex = currentRow < 3 ? activeCell + 4 : activeCell;
        break;
      case "ArrowLeft":
        newIndex = currentCol > 0 ? activeCell - 1 : activeCell;
        break;
      case "ArrowRight":
        newIndex = currentCol < 3 ? activeCell + 1 : activeCell;
        break;
      default:
        return;
    }

    const newRow = Math.floor(newIndex / 4);
    const newCol = newIndex % 4;

    if (highlightingOrientation === 'row') {
      setHighlightedRow(newRow);
      setHighlightedColumn(null);
    } else {
      setHighlightedColumn(newCol);
      setHighlightedRow(null);
    }

    setActiveCell(newIndex);
    cellRefs[newIndex].current.focus();
  };

  return (
    <div className="stripe-background" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="title-bar">
        <h1 className="title-text">Orthoword</h1>
        <button className="question-btn" onClick={toggleModal}>
          <img src="/src/assets/question.png" alt="Help" />
        </button>
      </header>

      <div className="color-stripes">
        <div className="stripe-dark-orange"></div>
        <div className="stripe-orange"></div>
        <div className="stripe-yellow"></div>
      </div>

      <div className="flex gap-64 pb-20 h-full self-center items-center">
        <div className="aspect-square">
          <Grid
            grid={grid}
            highlightedRow={highlightedRow}
            highlightedColumn={highlightedColumn}
            activeCell={activeCell}
            handleKeyPress={handleKeyPress}
            handleCellClick={handleCellClick}
            cellRefs={cellRefs}
          />
        </div>
        <div className="w-full">
          <HintsPanel hints={hints} />
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={toggleModal}></div>
          <div className="modal">
            <div className="modal-content caveat-font">
              <h2>How to Play</h2>
              <p>Welcome to Orthoword!</p>
              <ul>
                <li>There are 8 clues, each corresponding to unique 4-letter words.</li>
                <li>Fill in the 4x4 grid with letters so each row and column matches a word.</li>
                <li>The clues are shuffled, so you need figure out which words go where.</li>
                <li>You may use the boxes next to the clues to jot down possible words.</li>
              </ul>
              <br></br>
              <p>Controls:</p>
              <ul>
                <li><strong>Arrow Keys:</strong> Move between cells.</li>
                <li><strong>Space:</strong> Toggle between horizontal and vertical.</li>
                <li><strong>Enter:</strong> Move to the start of the next row or column.</li>
                <li><strong>Delete:</strong> Remove a letter.</li>
                <li><strong>Type:</strong> Fill the cell with a letter.</li>
              </ul>
              <br></br>
              <p>Correctly fill the grid to win. Good luck!</p>
              <button className="close-btn" onClick={toggleModal}>X</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
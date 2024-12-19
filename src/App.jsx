import React, { useState, useRef } from 'react';
import './App.css';
import Grid from './Grid';

function App() {
  const [grid, setGrid] = useState(Array(16).fill("")); 
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [highlightedColumn, setHighlightedColumn] = useState(null);
  const [highlightingOrientation, setHighlightingOrientation] = useState('row');
  const [activeCell, setActiveCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hints = [
    "Expensive cheeses are?",
    "Company symbol",
    "Above",
    "Wet walk",
    "Small fly",
    "Soft radiance",
    "Intense radiance",
    "Ripped"
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
      
      // Reset the other dimension's highlight
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
    if (!activeCell && activeCell !== 0) return;
  
    // Space key handling to switch orientation
    if (e.key === " ") {
      setHighlightingOrientation(prev => 
        prev === 'row' ? 'column' : 'row'
      );
      
      // Reset the other dimension's highlight
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
        newIndex = (currentRow < 3) ? activeCell + 4 - currentCol: 0;
      } else if (highlightingOrientation === 'column') {
        newIndex = (currentCol < 3) ? activeCell + 1 - 4*currentRow: 0;
      }
  
      if (newIndex !== null) {
        setActiveCell(newIndex);
        cellRefs[newIndex].current.focus();
  
        // Update highlighting to match the new cell's row/column
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
  
    // Delete key handling to clear the cell and move backwards
    if (e.key === "Backspace" || e.key === "Delete") {
      const newGrid = [...grid];
      newGrid[activeCell] = "";
      setGrid(newGrid);
  
      let previousCell = null;
      
      if (highlightingOrientation === 'row') {
        // Move to the previous cell in the row
        previousCell = activeCell % 4 !== 0 ? activeCell - 1 : null;
      } else if (highlightingOrientation === 'column') {
        // Move to the previous cell in the column
        previousCell = activeCell >= 4 ? activeCell - 4 : null;
      }
  
      if (previousCell !== null) {
        setActiveCell(previousCell);
        cellRefs[previousCell].current.focus();
  
        // Update highlighting to match the previous cell's row/column
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
  
    switch(e.key) {
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
  
    // Update highlighting based on the new index
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
        <div className="stripe-red"></div>
        <div className="stripe-green"></div>
        <div className="stripe-blue"></div>
      </div>

      <div className="content-container">
        <div className="grid-container">
          <Grid
            grid={grid}
            highlightedRow={highlightedRow}
            highlightedColumn={highlightedColumn}
            activeCell={activeCell}
            handleKeyPress={handleKeyPress}
            handleCellClick={handleCellClick}
            cellRefs={cellRefs}
          />
          <div className="hints-container">
            <div className="hints-list bg-neutral-950 border-2 border-black p-4">
              {hints.map((hint, index) => (
                <div key={index} className="hint-row">
                  <div className="hint-text">{hint}</div>
                  <input type="text" className="hint-input" placeholder="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={toggleModal}></div>
          <div className="modal">
            <div className="modal-content">
              <h2>How to Play</h2>
              <p>Welcome to Orthoword!</p>
              <ul>
                <li>There are 8 clues, each corresponding to unique 4-letter words.</li>
                <li>You need to fill in the 4x4 grid with letters, where each row and column corresponds to one of the words.</li>
                <li>The clues are shuffled, and it's up to you to figure out which words go where.</li>
                <li>Click a cell to highlight the row or column (click again to switch), then type the letter.</li>
                <li>Correctly fill the grid to win - good luck!</li>
              </ul>
              <button className="close-btn" onClick={toggleModal}>X</button>
            </div>
          </div>
        </>
      )}
      
    </div>
  );
}

export default App;
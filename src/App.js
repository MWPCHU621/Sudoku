import React from 'react';
import logo from './logo.svg';
import './stylesheets/App.css';

import SudokuGame from "./components/sudokuBoard";


function App() {
  return (
    <div className="App">

      <h1 className="Header">Sudoku</h1>

      <SudokuGame className="Game"/>

    </div>
  );
}

export default App;

import React, {Component} from "react";
import * as Constants from "./constants";
import _ from 'lodash';

import RandNum from './randomNumGen';
import SudokuNumbers from './sudokuNumbers';

//StyleSheet
import '../stylesheets/sudokuBoard.css'
import { isArray } from "util";

class SudokuBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sudokuBoard: [],
            solution: [],
            difficulty: "normal",
            targetCell: null,
        }
    }

    componentDidMount() {
        let board = _.cloneDeep(Constants.SUDOKUBOARD);
        this.generateNewBoard(board);
        this.setState({sudokuBoard:board, solution:board});
    }

    render() {
        let {targetCell} = this.state;
        return(
            <div>
                <button className = "newGame_btn" onClick={this.onNewGameClick}>New Game</button>
                <button className = "solution_btn" >Solution</button>
                <table>
                    <tbody>
                        {this.state.sudokuBoard.map((row,i) => (
                                <tr>
                                    {row.map((cell, j) => (
                                        <td id={i+""+j} 
                                            // className={targetCell===null ? null : targetCell.row+targetCell.column === i+""+j ? "selected" : null}
                                            className = {this.getClassname(i,j)}
                                            onClick={this.onCellClick}>{cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>

                <SudokuNumbers className="availableNumbers" onClick={this.onNumberClick}/>
            </div> 
        )
    }

    getClassname = (row,col) => {
        let {targetCell} = this.state;
        let className = "";
        
        if(row === 2 || row === 5) {
            className += "bottomThick ";
        }

        if(col === 2 || col === 5) {
            className += " rightThick ";
        }


        if(!(targetCell === null)) {
            if(targetCell.row+targetCell.column === row + "" + col) {
                className += "selected";
            }
        }

        return className;
    }

    onCellClick = (e) => {
        let cellpos = e.target.id;

        this.setState({targetCell: {row: cellpos[0], column: cellpos[1]}});
        console.log(this.state.targetCell);
    }

    onNumberClick = (e) => {
        let {targetCell, sudokuBoard} = this.state;

        if(targetCell === null) {
            return;
        }
        
        let tempBoard = sudokuBoard;

        tempBoard[targetCell.row][targetCell.column] = e.target.innerText;

        if(!this.boardCheck(tempBoard, targetCell.row, targetCell.column)) {
            //resets the cell to empty string because of invalid number
            tempBoard[targetCell.row][targetCell.column] = "";


            alert("invalid number");

            return;
        }

        this.setState({sudokuBoard: tempBoard});
    }

    onNewGameClick = (e) => {
        e.preventDefault();
        let board = _.cloneDeep(Constants.SUDOKUBOARD);
        this.setState({
            sudokuBoard: board, 
            targetCell:null
        });

        this.generateNewBoard(board);
    }

    generateNewBoard = (board) => {
        this.backtrackAlgo(board); 

    }

    backtrackAlgo = (board) => {
        debugger;

        let row = 0;
        if ( row === 9 ) {
            return;
        } else {
            let hasValidRow = this.fillRow(board, row, 0);
            while(row < 8) {
                if ( !hasValidRow ) {
                    row--;
                    this.fillRow(board, row, 0);
                } else {
                    row++;
                    this.fillRow(board, row, 0);
                }
            }

        }
    }

    fillRow = (board, row, col) => {
        debugger;


        let validNumbers = this.findAllValidNumbers(board, row, col); // find all valid numbers for that cell.
        let validNumLength = validNumbers.length;

        if(validNumLength === 0) return false;
        else {
            let index = 0;
            board[row][col] = validNumbers[index];
            if(col === 8) return true;
            else {
                let validInput = this.fillRow(board, row, col+1);
                while(index < validNumLength-1) {
                    if(!validInput) {
                        index++;
                        board[row][col] = validNumbers[index];
                        validInput = this.fillRow(board, row, col+1);
                    } else break;
                }
                if(!validInput) { 
                    board[row][col] = ""; //need to set cell to empty in order to not affect the findAllValidNumber function.
                } else return validInput;
            }
        } 
    }


    removeCells = (board) => {
        
    }

    // #region CHECK FUNCTIONS

    boardCheck = (board, cellRow, cellCol) => {

        if( !this.checkRow(board, cellRow, cellCol) || 
            !this.checkColumn(board, cellRow, cellCol) || 
            !this.checkSurrounding(board, cellRow, cellCol)) return false;

        return true;

    }

    checkRow = (board, cellRow, cellCol) => {
        let checkArr = [];

        //stores current state of row exluding cell in question into checkArr.
        board[cellRow].forEach((cell, i) => {
            if(i === parseInt(cellCol)) return;

            checkArr.push(board[cellRow][i]);
        });

        // checks to see if cell in question is a valid input.
        if(checkArr.includes(board[cellRow][cellCol])) {
            return false;
        }
        
        return true;
    }

    checkColumn = (board, cellRow, cellCol) => {
        let checkArr = [];
        //checks row

        for(let i=0; i< 9; i++) {
            if(i === parseInt(cellRow)) continue;

            checkArr.push(board[i][cellCol]);
        }

        if(checkArr.includes(board[cellRow][cellCol])) {
            return false;
        }

        return true;
    }

    checkSurrounding = (board, cellRow, cellCol) => {

        let rowLimit = 0;
        let colLimit = 0;
        if(cellRow >= 0 && cellRow <= 2) {
            rowLimit = 3; 
        } else if(cellRow >= 3 && cellRow <= 5) {
            rowLimit = 6;
        } else {
            rowLimit = 9;
        }

        if(cellCol >= 0 && cellCol <= 2) {
            colLimit = 3; 
        } else if(cellCol >= 3 && cellCol <= 5) {
            colLimit = 6;
        } else {
            colLimit = 9;
        }

        return this.checkQuadrant(board, rowLimit, colLimit);
    }

    checkQuadrant = (board, rowLimit, colLimit) => {
        let checkArr = [];

        for(let i = rowLimit-3; i < rowLimit; i++) {
            for(let j = colLimit-3; j < colLimit; j++) {
                if(board[i][j] === "") continue;

                if(!checkArr.includes(board[i][j])) {
                    checkArr.push(board[i][j]);
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    // #endregion

    // #region HELPER FUNCTIONS

    shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    findAllValidNumbers = (board, cellRow, cellCol) => {

        let validNumbers = Constants.SUDOKUNUMBERS.filter(num => this.testNum(num, cellRow, cellCol, board));

        return this.shuffleArray(validNumbers);
   
    }


    testNum = (num, cellRow, cellCol, board) => {

        let temp = board[cellRow][cellCol];
        board[cellRow][cellCol] = num; //temporarily set the cell value as num.

        let result = this.boardCheck(board, cellRow, cellCol); //checks if the value is valid in that cell.

        board[cellRow][cellCol] = temp; //reverts the temporary cell value.

        return result;
    }

    genRandNum = () => {
        return Math.floor(Math.random() * (30 - 10 + 1) + 10);
    }

    checkNextCellValidNumbers = (board, currRow, currCol, nextRow, nextCol) => {
        let validNumArray = this.findAllValidNumbers(board, nextRow, nextCol);
        let validNumArrayLength = validNumArray.length;
        if(validNumArrayLength !== 9 - currCol + 1) return false;

        return true;
    }

    // #endregion

}

export default SudokuBoard;
import React, {Component} from "react";
import * as Constants from "./constants";
import _ from 'lodash';

import RandNum from './randomNumGen';
import SudokuNumbers from './sudokuNumbers';

//StyleSheet
import '../stylesheets/sudokuBoard.css'

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
        let board = _.cloneDeep(Constants.SudokuBoard);
        debugger;
        //this.generateNewBoard(board);
        this.setState({sudokuBoard:board});
    }

    render() {
        let {targetCell} = this.state;
        return(
            <div>
                <button className = "newGame_btn" onClick={this.onNewGameClick}>New Game</button>
                <button className = "Solution_btn" >Solution</button>
                <table>
                    <tbody>
                        {this.state.sudokuBoard.map((row,i) => (
                                <tr>
                                    {row.map((cell, j) => (
                                        <td id={i+""+j} 
                                            className={targetCell===null ? null : targetCell.row+targetCell.column === i+""+j ? "selected" : null}
                                            onClick={this.onCellClick}>{cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>

                <SudokuNumbers className="AvailableNumbers" onClick={this.onNumberClick}/>
            </div> 
        )
    }

    onCellClick = (e) => {
        let cellpos = e.target.id;

        this.setState({targetCell: {row: cellpos[0], column: cellpos[1]}});
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
        let board = _.cloneDeep(Constants.SudokuBoard);
        this.setState({
            sudokuBoard: board, 
            targetCell:null
        });
    }

    generateNewBoard = (board) => {
        debugger;
        this.backtrackAlgo(board);
    }

    backtrackAlgo = (board) => {
       
    }

    generateValidNumber = (usedNum) => {
        let genNum = RandNum();
        //generate a number that hasn't been used before.
        while(usedNum.includes(genNum) && usedNum.length < 9){
            genNum = RandNum();
        }

        return genNum;
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

    checkSurrounding = (board, cellRow, cellCol)=> {
        //debugger;
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
}

export default SudokuBoard;





 // debugger;
        // for(let i=0; i<9; i++) {
        //     for(let j=0; j<9; j++) {
        //         let usedNum = [];
        //         let numToInsert = this.generateValidNumber(usedNum);
        //         board[i][j] = numToInsert;
        //         let validInput = true;
        //         while(!this.boardCheck(board, i, j) && usedNum.length < 9) {
        //             board[i][j] = "";

        //             if(!usedNum.includes(numToInsert)) {
        //                 usedNum.push(numToInsert);
        //             }
                    
        //             if(usedNum.length === 9) {
        //                 validInput = false;
        //             }

        //             numToInsert = this.generateValidNumber(usedNum);
        //             board[i][j] = numToInsert;
        //         }

        //         if(!validInput) {
        //             if(j === 0) {
        //                 i--;
        //                 j = 7;
        //             } else {
        //                 j-=2;
        //             }
        //         }
        //         console.log(board);
        //     }
        // }
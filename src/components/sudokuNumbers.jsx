import React, {Component} from 'react';
import { SUDOKUNUMBERS } from './constants';

import '../stylesheets/sudokuNumbers.css'

class SudokuNumbers extends Component {

    render() {
        return(
            <table>
                <tbody>
                    <tr>
                        {SUDOKUNUMBERS.map((num, i) => ( <td key={i+1} onClick={this.props.onClick}> {num} </td> ))}
                    </tr> 
                </tbody>
            </table>
        )
    }
};

export default SudokuNumbers;
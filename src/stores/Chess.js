import { makeAutoObservable, toJS } from "mobx";

import { board } from "../utils/board";
import { calculateAvailablePath, getRules } from "../utils/rules";

import { cloneDeep } from "lodash";

class Chess {

    board = board;

    moves = 0;
    currentPlayer = "white";
    selectedField = null;

    constructor() {
        makeAutoObservable(this);
    }

    onFieldClick = (field) => {
        this.clearBoard();
        
        if (!field.piece) return;

        this.selectedField = field;

        const rules = getRules(this.board, this.moves, field);
        calculateAvailablePath(this.board, rules, field.field);


        debugger

        this.moves ++;
    }

    clearBoard() {
        this.board.forEach(row => row.forEach(column => column.isAvailable = false));
    }

}

export default Chess;
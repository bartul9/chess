import { makeAutoObservable, toJS } from "mobx";

import { board } from "../utils/board";
import { calculateAvailablePath, moveTo } from "../utils/rules";


class Chess {

    board = board;

    moves = 0;
    currentPlayer = "white";
    selectedField = null;

    whiteRemovedPieces = [];
    blackRemovedPieces = [];

    constructor() {
        makeAutoObservable(this);
    }

    onFieldClick = (field) => {
        this.clearBoard();
        
        if (!field.piece) return;

        this.selectedField = field;

        calculateAvailablePath(this.board, this.moves, field);
    }

    movePiece = (newField) => {

        const removedPiece = moveTo(this.board, this.selectedField, newField);

        if (removedPiece) {
            this[removedPiece.color + "RemovedPieces"].push(removedPiece);
        }

        this.clearBoard();

        this.moves++;
    }

    clearBoard() {
        this.board.forEach(row => row.forEach(column => {
            column.isAvailable = false;
            column.canAttack = false;
            this.selectedField = null;
        }));
    }

}

export default Chess;
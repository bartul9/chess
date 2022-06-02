import { makeAutoObservable } from "mobx";

import { board } from "../utils/board";
import { calculateAvailablePath, getFieldRowAndColumn, moveTo } from "../utils/rules";
import PawnChangeModalStore from "./PawnChangeModalStore";


class Chess {

    board = board;

    moves = 0;
    currentPlayer = "white";
    selectedField = null;

    whiteRemovedPieces = [];
    blackRemovedPieces = [];

    winner = null;
    checkMate = null;

    constructor() {
        makeAutoObservable(this);

        this.pawnChangeModal = new PawnChangeModalStore();
    }

    onFieldClick = (field) => {
        this.clearBoard();
        
        if (!field.piece || (field.piece && field.piece.color !== this.currentPlayer)) return;

        this.selectedField = field;

        calculateAvailablePath(this.board, this.moves, field);
    }

    movePiece = (newField) => {
        const { canAttack, isAvailable } = newField;
        if (!canAttack && !isAvailable) return;

        const removedPiece = moveTo(this.board, this.selectedField, newField);

        if (removedPiece) {
            if (removedPiece.name === "king") this.winner = this.currentPlayer.toUpperCase();
            this[removedPiece.color + "RemovedPieces"].push(removedPiece);
        }

        this.clearBoard();

        this.moves++;

        this.checkIfPawnOnLastRow();
        this.onSwitchCurrentPlayer();
    }

    onSwitchCurrentPlayer() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    }

    checkIfPawnOnLastRow() {
        const pawnOnLastRow = this.board[this.currentPlayer === "white" ? 7 : 0].find(field => field.piece && field.piece.name === "pawn");

        if (pawnOnLastRow) {
            const [ row, column ] = getFieldRowAndColumn(String(pawnOnLastRow.field));

            const currentField = this.board[row][column];

            const removedPieces = this[this.currentPlayer + "RemovedPieces"];

            if (removedPieces.length > 0) {
                this.pawnChangeModal.open(removedPieces, currentField);
            } else {
                currentField.piece = null;
            }
        }
    }

    clearBoard() {
        this.board.forEach(row => row.forEach(column => {
            column.isAvailable = false;
            column.canAttack = false;
        }));

        this.selectedField = null;
    }

}

export default Chess;
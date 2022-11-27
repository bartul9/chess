import { makeAutoObservable } from "mobx";

import { board, randomizeBoard } from "../utils/board";
import { calculateAvailablePath, moveTo, checkIfPawnOnLastRow } from "../utils/rules";
import PawnChangeModalStore from "./PawnChangeModalStore";


class Chess {

    board = board;
    moves = 0;
    currentPlayer = "white";
    selectedField = null;

    whiteRemovedPieces = [];
    blackRemovedPieces = [];

    winner = null;

    constructor() {
        makeAutoObservable(this);

        this.pawnChangeModal = new PawnChangeModalStore();
    }

    // When clicked on any field, if piece exists on field calculate available path for selected piece, also clear board from previous paths
    onFieldClick = (field) => {
        if (this.winner) return;

        this.clearBoard();
        
        if (!field.piece || (field.piece && field.piece.color !== this.currentPlayer)) return;

        this.selectedField = field;

        calculateAvailablePath(this.board, field);
    }

    // Move piece to selected field, if that field contains piece from other player, remove that piece from board
    movePiece = (newField) => {
        const { canAttack, isAvailable } = newField;
        if (!canAttack && !isAvailable) return;

        const removedPiece = moveTo(this.board, this.selectedField, newField);

        this.moves++;

        // If removed piece is king, that means that current player is winner
        if (removedPiece) {
            if (removedPiece.name === "king") {
                this.winner = this.currentPlayer;
            }

            this[removedPiece.color + "RemovedPieces"].push(removedPiece);
        }

        this.clearBoard();

        if (this.winner) return;

        checkIfPawnOnLastRow(this);
        this.onSwitchCurrentPlayer();
    }

    onSwitchCurrentPlayer() {
        this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    }

    clearBoard() {
        this.board.forEach(row => row.forEach(field => {
            field.isAvailable = false;
            field.canAttack = false;
        }));

        this.selectedField = null;
    }

    resetGame = () => {
        this.board = board;
        this.moves = 0;
        this.currentPlayer = "white";
        this.selectedField = null;
        this.whiteRemovedPieces = [];
        this.blackRemovedPieces = [];
        this.winner = null;
    }

    randomizeBoardAndCheckForCheckmate = () => {
        this.resetGame();

        this.board = randomizeBoard();

        this.currentPlayer = Math.random() > 0.5 ? "white" : "black";
    }

}

export default Chess;
import { makeAutoObservable } from "mobx";

import { board } from "../utils/board";
import { calculateAvailablePath, moveTo } from "../utils/rules";
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

        if (removedPiece) {
            if (removedPiece.name === "king") {
                this.winner = this.currentPlayer.toUpperCase();
            }
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

    // Check if there are any pawns on last row for selected user, if true show modal in which user can select piece to return to board
    checkIfPawnOnLastRow() {
        const pawnOnLastRow = this.board[this.currentPlayer === "white" ? 7 : 0].find(field => field.piece && field.piece.name === "pawn");

        if (pawnOnLastRow) {
            const removedPieces = this[pawnOnLastRow.piece.color + "RemovedPieces"];

            const onReturnPieceToField = (p) => {
                this[pawnOnLastRow.piece.color + "RemovedPieces"] = [...removedPieces.slice(0, removedPieces.indexOf(p)), ...removedPieces.slice(removedPieces.indexOf(p) + 1)];
            }

            if (removedPieces.length > 0 && removedPieces.some(piece => piece.name !== "pawn")) {
                this.pawnChangeModal.open(
                    removedPieces, 
                    pawnOnLastRow, 
                    (p) => onReturnPieceToField(p))
            } else {
                pawnOnLastRow.piece = null;
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

    resetGame = () => {
        this.board = board;
        this.moves = 0;
        this.currentPlayer = "white";
        this.selectedField = null;
        this.whiteRemovedPieces = [];
        this.blackRemovedPieces = [];
        this.winner = null;
    }

}

export default Chess;
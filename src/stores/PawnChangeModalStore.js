import { makeAutoObservable } from "mobx";


class PawnChangeModalStore {

    removedPieces = [];
    currentField = null;
    onReturnPiece = null;
    isOpen = false;

    constructor() {
        makeAutoObservable(this);
    }

    open(removedPieces, currentField, onReturnPiece) {
        this.removedPieces = removedPieces;
        this.currentField = currentField;
        this.onReturnPiece = onReturnPiece;
        this.isOpen = true;
    }

    onSelectPieceToReturn = (piece) => {
        this.currentField.piece = piece;
        this.onReturnPiece(piece);
        this.close();
    }

    close() {
        this.removedPieces = [];
        this.currentField = null;
        this.onReturnPiece = null;
        this.isOpen = false;
    }
}

export default PawnChangeModalStore;
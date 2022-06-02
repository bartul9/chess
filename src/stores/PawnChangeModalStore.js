import { makeAutoObservable } from "mobx";


class PawnChangeModalStore {

    removedPieces = null;
    currentField = null;
    onReturnPiece = null;

    constructor() {
        makeAutoObservable(this);
    }

    open(removedPieces, currentField, onReturnPiece) {
        this.removedPieces = removedPieces;
        this.currentField = currentField;
        this.onReturnPiece = onReturnPiece;
    }

    onSelectPieceToReturn = (piece) => {
        this.currentField.piece = piece;
        this.onReturnPiece(piece);
        this.close();
    }

    close() {
        this.removedPieces = null;
        this.currentField = null;
        this.onReturnPiece = null;
    }
}

export default PawnChangeModalStore;
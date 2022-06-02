import { makeAutoObservable } from "mobx";


class PawnChangeModalStore {

    removedPieces = null;
    currentField = null;

    constructor() {
        makeAutoObservable(this);
    }

    open(removedPieces, currentField) {
        this.removedPieces = removedPieces;
        this.currentField = currentField;
    }

    onSelectPieceToReturn = (piece) => {
        this.currentField.piece = piece;
        this.close();
    }

    close() {
        this.removedPieces = null;
        this.currentField = null;
    }
}

export default PawnChangeModalStore;
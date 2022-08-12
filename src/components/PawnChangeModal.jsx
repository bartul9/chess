import React from "react";
import { observer } from "mobx-react";

import "./PawnChangeModal.css";
import * as images from "../assetes/pieces-icons";

const PawnChangeModal = observer(({ store: {
    removedPieces,
    isOpen,
    onSelectPieceToReturn
}}) => {

    return (
        <div className="modal" style={{ display: isOpen ? "block" : "none" }}>
            <div className="PawnChangeModal">
                <h2 className="title">Select piece to return</h2>
                <div>
                    {removedPieces.map(piece => {     
                        const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                        return <img key={Math.random()} className="pieces removedPiece" onClick={() => piece.name !== "pawn" && onSelectPieceToReturn(piece)} src={images[name]} alt="null" style={{ borderBottom: piece.name === "pawn" ? "3px solid red" : "3px solid lightgreen"}} /> 
                    })}
                </div>
            </div>
        </div>
    )
})


export default PawnChangeModal;

import React from "react";
import { observer } from "mobx-react";

import "./PawnChangeModal.css";
import * as images from "../assetes/pieces-icons";

const PawnChangeModal = observer(({ store: {
    removedPieces,
    onSelectPieceToReturn
}}) => {

    return (
        <div className="PawnChangeModal">
            <h2>Select piece to return</h2>
            <div>
                {removedPieces.map(piece => {     
                    const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                    return <img key={Math.random()} className="pieces" onClick={() => piece.name !== "pawn" && onSelectPieceToReturn(piece)} src={images[name]} alt="null" style={{ borderBottom: piece.name === "pawn" && "3px solid red" }} /> 
                })}
            </div>
        </div>
    )
})


export default PawnChangeModal;

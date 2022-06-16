import React from "react";
import { observer } from "mobx-react";

import "./TableFields.css";
import * as images from "../assetes/pieces-icons";

const TableField = observer(({ field, onFieldClick, movePiece, selected }) => {
    const { piece, isAvailable, canAttack, checkmateColor, mustMoveKing } = field;

    const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";

    return (
        <div onClick={() => (isAvailable || canAttack) ? movePiece(field) : onFieldClick(field)} className="TableField" style={{ backgroundColor: mustMoveKing ? (checkmateColor === "black" ? "orange" : "gold") : (canAttack ? "#FF6347fa" : (selected ? "#228B22aa" : (String(field.field)[2] == 2 ? "#9c9a9a" : "white")))}}>

            <div>

                {piece && <img src={images[name]} alt="null" style={{ width: "50px" }} />}

                {<div style={{ position: "absolute", width: 20, height: 20, borderRadius: "50%", backgroundColor: mustMoveKing ? "" : (checkmateColor == "white" ? "gold" : (checkmateColor == "black" ? "orange" : (isAvailable ? "#4169E1" : "")))}}></div>}
                
                <span style={{ color: checkmateColor ? "black" : (String(field.field)[2] == 2 || canAttack || selected) ? "white" : "black" }} className="boardNum">{String(field.field)[0] + mapFieldNumToLetter(String(field.field)[1])}</span>

            </div>

        </div>
    )
})

function mapFieldNumToLetter(num) {
    switch(+num) {
        case 1:
            return "a";
        case 2:
            return "b";
        case 3:
            return "c";
        case 4:
            return "d";
        case 5:
            return "e";
        case 6:
            return "f";
        case 7:
            return "g";
        case 8:
            return "h";
        default:
            return "";
    }
}

export default TableField;

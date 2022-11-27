import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import "./TableFields.css";
import * as images from "../assetes/pieces-icons";

const TableField = observer(({ field, onFieldClick, movePiece, selected }) => {
    const { piece, isAvailable, canAttack, checkmate } = field;

    const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";

    return (
        <div 
            onClick={() => (isAvailable || canAttack) ? movePiece(field) : onFieldClick(field)} 
            className={"TableField " + classNames({
                "checkmateWhite": checkmate && piece && piece.color === "white",
                "checkmateBlack": checkmate && piece && piece.color === "black",
                "whiteField": !canAttack && !selected && String(field.field)[2] != 2 && !checkmate,
                "blackField": !canAttack && !selected && String(field.field)[2] == 2 && !checkmate,
                "canAttack": canAttack,
                "selected": selected,
            })}
        >

            <div>

                {piece && <img className="pieces" src={images[name]} alt="null" />}

                <div 
                    className={"pathColors " + classNames({
                        "isAvailable": isAvailable
                    })}
                >
                </div>
                
                <span 
                    style={{ color: String(field.field)[2] == 2 ? "white" : "black" }} 
                    className="boardNum"
                >
                    {String(field.field)[0] + mapFieldNumToLetter(String(field.field)[1])}
                </span>

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

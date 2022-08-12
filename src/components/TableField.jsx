import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";

import "./TableFields.css";
import * as images from "../assetes/pieces-icons";

const TableField = observer(({ field, onFieldClick, movePiece, selected }) => {
    const { piece, isAvailable, canAttack, checkmateWhite, checkmateBlack, checkmatePathWhite, checkmatePathBlack } = field;

    const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";

    console.log(field.field, checkmateBlack)

    return (
        <div 
            onClick={() => (isAvailable || canAttack) ? movePiece(field) : onFieldClick(field)} 
            className={"TableField " + classNames({
                "whiteField": !checkmateWhite && !checkmateBlack && !canAttack && !selected && String(field.field)[2] != 2,
                "blackField": !checkmateWhite && !checkmateBlack && !canAttack && !selected && String(field.field)[2] == 2,
                "checkmateWhite": checkmateWhite,
                "checkmateBlack": checkmateBlack,
                "canAttack": canAttack,
                "selected": selected

            })}
        >

            <div>

                {piece && <img className="pieces" src={images[name]} alt="null" />}

                <div 
                    className={"pathColors " + classNames({
                        "checkmateWhite": checkmatePathWhite,
                        "checkmateBlack": checkmatePathBlack,
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

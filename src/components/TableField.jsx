import React from "react";
import { observer } from "mobx-react";

import "./TableFields.css";
import * as images from "../assetes/pieces-icons";

const TableField = observer(({ field, onFieldClick, selected }) => {
    const { piece, isAvailable } = field;

    const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
    const backgroundColor = isAvailable ? "blue" : (selected ? "red" : (String(field.field)[2] == 2 ? "#9c9a9a" : "white"));

    return (
        <div onClick={() => onFieldClick(field)} className="TableField" style={{ backgroundColor: backgroundColor }}>

            <div style={{ color: String(field.field)[2] == 2 ? "white" : "black" }}>

                {piece && <img src={images[name]} alt="null" style={{ width: "50px"}} />}
                
                <span className="boardNum">{String(field.field)[0] + mapFieldNumToLetter(String(field.field)[1])}</span>

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
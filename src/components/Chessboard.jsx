import React from "react";
import { observer } from "mobx-react";

import "./Chessboard.css";
import TableField from "./TableField";

const Chessboard = observer(({ rootStore }) => {

    const { 
        onFieldClick,
        selectedField,
        board
    } = rootStore;

    return (
        <div className="Chessboard">
            {
                board.map(row => <div key={Math.random()} className="row">{row.map(field => <TableField selected={selectedField && selectedField.field == field.field} onFieldClick={onFieldClick} key={field.field} field={field} />)}</div>)
            }
        </div>
    )
})


export default Chessboard;

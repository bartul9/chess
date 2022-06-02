import React from "react";
import { observer } from "mobx-react";

import "./Chessboard.css";
import * as images from "../assetes/pieces-icons";
import TableField from "./TableField";

const Chessboard = observer(({ rootStore }) => {

    const { 
        onFieldClick,
        movePiece,
        selectedField,
        currentPlayer,
        board,
        whiteRemovedPieces,
        blackRemovedPieces,
        winner
    } = rootStore;

    return (
        <div className="Chessboard">
            {winner && <h1>Winner is {winner} player</h1>}
            <div>
                <div>
                    {whiteRemovedPieces.length > 0 && whiteRemovedPieces.map(piece => {     
                        const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                        return <img src={images[name]} alt="null" style={{ width: "50px"}} /> 
                    })}
                </div>
                <div className="board">
                    {
                        board.map(row => <div key={Math.random()} className="row">{row.map(field => <TableField movePiece={movePiece} selected={selectedField && selectedField.field == field.field} onFieldClick={onFieldClick} key={field.field} field={field} />)}</div>)
                    }
                </div>
                <div>
                    {blackRemovedPieces.length > 0 && blackRemovedPieces.map(piece => {     
                        const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                        return <img src={images[name]} alt="null" style={{ width: "50px"}} /> 
                    })}
                </div>
            </div>
            <h2>Current player: {currentPlayer.toUpperCase()}</h2>
        </div>
    )
})


export default Chessboard;

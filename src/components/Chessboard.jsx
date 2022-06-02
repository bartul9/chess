import React from "react";
import { observer } from "mobx-react";

import "./Chessboard.css";
import * as images from "../assetes/pieces-icons";
import TableField from "./TableField";
import PawnChangeModal from "./PawnChangeModal";

const Chessboard = observer(({ rootStore }) => {

    const { 
        moves,
        onFieldClick,
        resetGame,
        movePiece,
        selectedField,
        currentPlayer,
        board,
        whiteRemovedPieces,
        blackRemovedPieces,
        selectRemovedPiece,
        pawnChangeModal,
        winner
    } = rootStore;

    return (
        <>
            <div className="Chessboard">
                {pawnChangeModal.removedPieces ? <PawnChangeModal store={pawnChangeModal} /> : 
                <div className="boardContainer">
                    <div className="infoContainer">
                        {winner && <h1>Winner is {winner} player</h1>}
                        <div className="currentPlayerTitle">
                            <h3>Current player:</h3> <h2 style={{ marginLeft: "10px" }}>{currentPlayer.toUpperCase()}</h2>
                        </div>
                        <div className="currentPlayerTitle">
                            <h3>Moves: {moves}</h3>
                        </div>

                        <button onClick={resetGame}>Reset</button>
                    </div>
                    <div>
                        <div className="removedPieces">
                            {whiteRemovedPieces.length > 0 && whiteRemovedPieces.map(piece => {     
                                const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                                return <img key={Math.random()} onClick={() => selectRemovedPiece(piece)} src={images[name]} alt="null" style={{ width: "50px"}} /> 
                            })}
                        </div>
                        <div className="board">
                            {
                                board.map(row => <div key={Math.random()} className="row">{row.map(field => <TableField key={field.field} movePiece={movePiece} selected={selectedField && selectedField.field == field.field} onFieldClick={onFieldClick} key={field.field} field={field} />)}</div>)
                            }
                        </div>
                        <div className="removedPieces">
                            {blackRemovedPieces.length > 0 && blackRemovedPieces.map(piece => {     
                                const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                                return <img key={Math.random()} onClick={() => selectRemovedPiece(piece)} src={images[name]} alt="null" style={{ width: "50px"}} /> 
                            })}
                        </div>
                    </div>
                </div>}
            </div>
        </>
        
    )
})


export default Chessboard;

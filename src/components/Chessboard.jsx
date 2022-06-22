import React from "react";
import { observer } from "mobx-react";

import "./Chessboard.css";
import * as images from "../assetes/pieces-icons";
import TableField from "./TableField";
import PawnChangeModal from "./PawnChangeModal";

import { chessIcon } from "../assetes/pieces-icons/index";

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
        winner,
        checkmate
    } = rootStore;

    const winnerStyling = (winner) => ({ color: winner === "Black" ? "white" : "black", backgroundColor: winner === "Black" ? "black" : "white", border: "3px solid black", borderRadius: "20px", width: "fit-content", padding: "5px" });

    return (
        <>
            <div className="Chessboard">
                {pawnChangeModal.removedPieces ? <PawnChangeModal store={pawnChangeModal} /> : 
                <div className="boardContainer">
                    <div className="infoContainer">
                        <div className="title" ><img style={{ marginRight: 20 }} width={50} src={chessIcon} alt="" /> <h1>Chess</h1></div>
                        <div className="legend">
                            <b>Legend:</b>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "#228B22aa", borderRadius: 0 }}></span>
                                <span className="legendText">- Selected field</span>
                            </div>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "#4169E1"}}></span>
                                <span className="legendText">- Available to move</span>
                            </div>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "#FF6347fa", borderRadius: 0 }}></span>
                                <span className="legendText">- Can attack field</span>
                            </div>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "orange" }}></span>
                                <span className="legendText">- Checkmate field white</span>
                            </div>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "orange", borderRadius: 0 }}></span>
                                <span className="legendText">- Checkmate on king white</span>
                            </div>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "gold" }}></span>
                                <span className="legendText">- Checkmate field black</span>
                            </div>
                            <div className="legendDivs">
                                <span className="legendColors" style={{ backgroundColor: "gold", borderRadius: 0 }}></span>
                                <span className="legendText">- Checkmate on king black</span>
                            </div>
                        </div>
                        {winner && <h2 style={ winnerStyling(winner) }>Winner is {winner} player</h2>}
                        {checkmate && <h2 style={ winnerStyling(checkmate) }>Checkmate {checkmate}</h2>}
                        <div className="currentPlayerTitle">
                            <span className="currentPlayerText">Current player:</span> <h2 style={{ marginLeft: "10px" }}>{currentPlayer.toUpperCase()}</h2>
                        </div>
                        <div className="currentPlayerTitle">
                            <span className="currentPlayerText">Moves:</span> <h3 style={{ marginLeft: "10px" }}>{moves}</h3>
                        </div>

                        <button className="resetBtn" onClick={resetGame}>Reset</button>
                    </div>
                    <div>
                        <div className="removedPieces">
                            {whiteRemovedPieces.length > 0 && whiteRemovedPieces.map(piece => {     
                                const name = piece ? piece.name + (piece.color[0].toUpperCase() + piece.color.slice(1)) : "";
                                return <img key={Math.random()} onClick={() => selectRemovedPiece(piece)} src={images[name]} alt="null" style={{ width: "50px"}} /> 
                            })}
                        </div>
                        <div style={{ border: "19px solid black", borderRadius: 5 }}>
                            <div style={{ border: "16px solid silver" }}>
                                <div style={{ border: "13px solid #454545" }}>
                                    <div className="board">
                                        {
                                            board.map(row => <div key={Math.random()} className="row">{row.map(field => <TableField key={field.field} movePiece={movePiece} selected={selectedField && selectedField.field == field.field} onFieldClick={onFieldClick} field={field} />)}</div>)
                                        }
                                    </div>
                                </div>
                            </div>
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

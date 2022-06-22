import { cloneDeep } from "lodash";


const getFieldRowAndColumnIndex = (field) => {
    return [field[0] - 1, field[1] - 1];
}

const getAllFieldsWithPieces = (board) => board.map(row => row.filter(field => field.piece)).flat();

// Returns directions and number of steps in which selected piece can move
const getRules = (board, selectedField, kingsFields) => {
    if (!selectedField) debugger
    const { piece: { color, name }, field } = selectedField;

    const isWhite = color === "white";

    const [ row, column ] = getFieldRowAndColumnIndex(String(field));

    const rules = {
        pawn: {
            getPath: () => {

                let maxSteps  = !selectedField.piece.pawnMoved ? 2 : 1;

                const canAttackCheck = (n1, n2, isAttack = true) => {
                    const nextRow = row + n1;
                    const nextColumn = column + n2;

                    // If next row or column is beyond border return
                    if (nextRow <= -1 || nextRow >= 8) return; 
                    if (nextColumn <= -1 || nextColumn >= 8) return;

                    const nextField = board[nextRow][nextColumn];

                    if (!selectedField.piece.pawnMoved && !isAttack && !nextField.piece) {
                        const nextNextField = board[nextRow + n1][nextColumn + n2];
                        maxSteps = !nextNextField.piece ? 2 : 1;
                        return [n1, n2];
                    }

                    if (isAttack && nextField && kingsFields && kingsFields.includes(nextField)) {
                        return [n1, n2]
                    }

                    return ((isAttack && nextField && nextField.piece && nextField.piece.color !== color) || ((!isAttack && !nextField.piece)) ? [n1, n2] : 0);
                }

                return [isWhite ? [[ 0, 0, 0 ], [ 0, field, 0 ], [canAttackCheck(1, -1), canAttackCheck(1, 0, false), canAttackCheck(1, 1)]] : [
                    [ canAttackCheck(-1, -1), canAttackCheck(-1, 0, false), canAttackCheck(-1, 1)],
                    [ 0, field, 0 ],
                    [ 0, 0, 0 ]
                ], maxSteps];
            }
        },
        rook: {
            getPath: () => {
                const path = 
                [
                    [ 0, [-1, 0], 0 ],
                    [ [0, -1], field, [0, 1] ],
                    [ 0, [1, 0], 0 ],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        knight: {
            getPath: () => {
                const path = 
                [
                    [ 0, [-2, -1], 0, [-2, 1], 0 ],
                    [ [-1, -2], 0, 0, 0, [-1, 2] ],
                    [ 0, 0, field, 0, 0 ],
                    [ [1, -2], 0, 0, 0, [1, 2] ],
                    [ 0, [2, -1], 0, [2, 1], 0 ],
                ];

                const maxSteps = 1;

                return [path, maxSteps];
            }
        },
        bishop: {
            getPath: () => {
                const path = 
                [
                    [ [-1, -1], 0, [-1, 1] ],
                    [ 0, field, 0 ],
                    [ [1, -1], 0, [1, 1] ],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        queen: {
            getPath: () => {
                const path = 
                [
                    [ [-1, -1], [1, 0], [-1, 1] ],
                    [ [0, -1], field, [0, 1] ],
                    [ [1, -1], [-1, 0], [1, 1] ],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        king: {
            getPath: () => {
                const path = 
                [
                    [ [-1, -1], [1, 0], [-1, 1] ],
                    [ [0, -1], field, [0, 1] ],
                    [ [1, -1], [-1, 0], [1, 1] ],
                ];

                const maxSteps = 1;

                return [path, maxSteps];
            }
        }
    }

    return rules[name].getPath();
};

export const calculateAvailablePath = (board, field, returnKingFields, enemyPieces, canPathBeBlocked) => {
    const [ path, maxSteps ] = getRules(board, field);
    const [ row, column ] = getFieldRowAndColumnIndex(String(field.field));

    const calculatedData = {
        kingFields: [],
        defendingPiece: null,
        canPathBeBlocked: null
    }

    // Loop over path arrays and for every direction in which piece can move, repeat that move until available steps for selected piece are maxed out, or until path hits other piece or border
    path.forEach(arr => {
        // 0 means piece cant move in that direction
        if (arr.every(f => f === 0)) return;

        arr.forEach(c => {
            // c is array with two numbers representing direction in which piece can move, etc. [-1, -1] means current row - 1 and current column - 1
            if (typeof c === "object") {

                // Selected piece position
                let currentRow = row;
                let currentColumn = column;

                const checkmateFieldName = field.piece.color === "white" ? "checkmateWhite" : "checkmateBlack";

                for (let step = 1; step <= maxSteps; step++) {
                    const nextRow = currentRow + c[0];
                    const nextColumn = currentColumn + c[1];

                    // If next row or column is beyond border return
                    if (nextRow <= -1 || nextRow >= 8) return; 
                    if (nextColumn <= -1 || nextColumn >= 8) return;

                    const nextField = board[nextRow][nextColumn];

                    if (nextField.piece != null) {
                        const { color } = nextField.piece;

                        if (color !== field.piece.color && !returnKingFields) {
                            if (enemyPieces && enemyPieces.includes(nextField)) {
                                calculatedData.defendingPiece = { attacking: nextField, defending: field };
                            } 
                            
                            if(!enemyPieces) {
                                nextField.canAttack = true;
                            }
                        }

                        if (!returnKingFields) return;
                    }

                    if (returnKingFields) {
                        calculatedData.kingFields.push(nextField);
                    } 

                    if (canPathBeBlocked && nextField[checkmateFieldName]) {
                        calculatedData.canPathBeBlocked = { checkmateField: nextField, defending: field };
                    }

                    if(!enemyPieces && !returnKingFields) {
                        nextField.isAvailable = true;
                    }

                    currentRow = nextRow;
                    currentColumn = nextColumn;
                }
            }
        })

    });

    return calculatedData;
}

const calculatePossibleCheckmate = (board, fields, checkmateColor) => {

    const checkmateFieldName = checkmateColor === "white" ? "checkmateWhite" : "checkmateBlack";
    const checkmatePathName = checkmateColor === "white" ? "checkmatePathWhite" : "checkmatePathBlack";

    const clearCalculatedPath = (path) => {
        path.forEach(field => {
            field[checkmateFieldName] = false;
        });
    }

    const enemyCheckmateFields = [];

    const king = fields.find(({ piece: { name, color } }) => name === "king" && color === checkmateColor);

    const { kingFields } = calculateAvailablePath(board, king, true);

    fields.filter(({ piece }) => piece.color !== checkmateColor).forEach(field => {

        const [ path, maxSteps ] = getRules(board, field, kingFields);
        const [ row, column ] = getFieldRowAndColumnIndex(String(field.field));

        // Loop over path arrays and for every direction in which piece can move, repeat that move until available steps for selected piece are maxed out, or until path hits other piece or border
        path.forEach(arr => {

            arr.forEach(c => {
                // c is array with two numbers representing direction in which piece can move, etc. [-1, -1] means current row - 1 and current column - 1
                if (typeof c === "object") {

                    if (field.piece.name === "pawn" && arr.indexOf(c) === 1) return;

                    // Selected piece position
                    let currentRow = row;
                    let currentColumn = column;

                    const calculatedPath = [];

                    for (let step = 1; step <= maxSteps; step++) {
                        const nextRow = currentRow + c[0];
                        const nextColumn = currentColumn + c[1];

                        // If next row or column is beyond border return
                        if (nextRow <= -1 || nextRow >= 8) {
                            clearCalculatedPath(calculatedPath);
                            return;
                        } 
                        if (nextColumn <= -1 || nextColumn >= 8) {
                            clearCalculatedPath(calculatedPath);
                            return;
                        } 

                        const nextField = board[nextRow][nextColumn];

                        if (nextField.piece != null) {
                            const { color, name } = nextField.piece;

                            if (color === checkmateColor && name === "king") {
                                nextField[checkmateFieldName] = true;
                                nextField.mustMoveKing = true;

                                enemyCheckmateFields.push(field);
                                
                                if (step < maxSteps) {
                                    const nextNextRow = nextRow + c[0];
                                    const nextNextColumn = nextColumn + c[1];

                                    // If next row or column is beyond border return
                                    if (nextNextRow <= -1 || nextNextRow >= 8) {
                                        return;
                                    } 
                                    if (nextNextColumn <= -1 || nextNextColumn >= 8) {
                                        return;
                                    } 

                                    const nextNextField = board[nextNextRow][nextNextColumn];

                                    if (nextNextField && !nextNextField.piece && kingFields.includes(nextNextField)) {
                                        nextNextField[checkmatePathName] = true;
                                    }
                                }

                                return;
                            } else {
                                clearCalculatedPath(calculatedPath);
                                return;
                            }
                        }

                        if (!nextField[checkmateFieldName]) calculatedPath.push(nextField);

                        nextField[checkmateFieldName] = true;

                        if (kingFields.includes(nextField)) {
                            nextField[checkmatePathName] = true;
                        }

                        if (step === maxSteps) clearCalculatedPath(calculatedPath);

                        currentRow = nextRow;
                        currentColumn = nextColumn;
                    }
                }
            })
        });
    })


    return {
        kingFields, 
        enemyCheckmateFields, 
    }
}

export const moveTo = (board, oldField, newField, skipPawnMoved) => {
    const [ newFieldRow, newFieldColumn ] = getFieldRowAndColumnIndex(String(newField.field));
    const [ oldFieldRow, oldFieldColumn ] = getFieldRowAndColumnIndex(String(oldField.field));

    let removedPiece;

    if (oldField.piece.name === "pawn" && !skipPawnMoved) oldField.piece.pawnMoved = true;

    if (newField.canAttack) {
        removedPiece = newField.piece;
    }

    board[newFieldRow][newFieldColumn].piece = oldField.piece;
    board[oldFieldRow][oldFieldColumn].piece = null;

    return removedPiece;
};

const canKingBeDefended = (board, color, enemyCheckmateFields) => {

    const canBeDefended = board.map(row => row.filter(field => field.piece != null && field.piece.color === color && field.piece.name !== "king")).flat().reduce((acc, field) => {

        const { defendingPiece, canPathBeBlocked } = calculateAvailablePath(board, field, null, enemyCheckmateFields, true);

        defendingPiece && acc.defenders.push(defendingPiece);
        canPathBeBlocked && acc.pathBlocking.push(canPathBeBlocked)

        return acc;
    }, { defenders: [], pathBlocking: []});

    if (canBeDefended.defenders.length > 0) {

        canBeDefended.defenders = canBeDefended.defenders.map(item => {
            const { attacking, defending } = item;
            const newBoard = cloneDeep(board);

            moveTo(newBoard, defending, attacking, true);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    if (canBeDefended.pathBlocking.length > 0) {

        canBeDefended.pathBlocking = canBeDefended.pathBlocking.map(item => {
            const { checkmateField, defending } = item;
            const newBoard = cloneDeep(board);

            moveTo(newBoard, defending, checkmateField, true);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    const defendingPossible = canBeDefended.defenders.length > 0 && canBeDefended.defenders.every(i => i === false);
    const blockingPathPossible = canBeDefended.pathBlocking.length > 0 && canBeDefended.pathBlocking.every(i => i === false);

    return defendingPossible || blockingPathPossible;
}

const canKingEatEnemyPiece = (board, color, king, enemyPieces) => {
    const { defendingPiece } = calculateAvailablePath(board, king, null, enemyPieces);

    let canEatEnemyPiece = defendingPiece ? [defendingPiece] : [];

    if (canEatEnemyPiece.length > 0) {

        canEatEnemyPiece = canEatEnemyPiece.map(item => {
            const { attacking, defending } = item;
            const newBoard = cloneDeep(board);

            moveTo(newBoard, defending, attacking, true);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    return canEatEnemyPiece.length > 0 && canEatEnemyPiece.every(i => i === false);
}

const canKingMoveOnEmptyField = (board, color, king, emptyFields) => {
    const checkmateFieldName = color === "white" ? "checkmateWhite" : "checkmateBlack";
    const checkmatePathName = color === "white" ? "checkmatePathWhite" : "checkmatePathBlack";

    if (emptyFields.length === 0) return false;
    if (emptyFields.length > 0 && emptyFields.every(field => field[checkmateFieldName] || field[checkmatePathName])) return false;

    let availableFields = emptyFields.filter(field => !field[checkmateFieldName] && !field[checkmatePathName]);

    if (availableFields.length > 0) {

        availableFields = availableFields.map(field => {
            const newBoard = cloneDeep(board);

            moveTo(newBoard, king, field, true);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length === 0;
        })
    } 

    return availableFields.every(i => i === true);
}

const isCheckmate = (board, currentPlayer, color) => {
        
    const fieldsWithPieces = getAllFieldsWithPieces(board);

    const { kingFields, enemyCheckmateFields } = calculatePossibleCheckmate(board, fieldsWithPieces, color);

    const emptyFields = kingFields.filter(field => !field.piece);
    const enemyPieces = kingFields.filter(field => field.piece && field.piece.color !== color);
    const king = fieldsWithPieces.find(({ piece }) => piece.name === "king" && piece.color === color);

    if (enemyCheckmateFields.length === 0) return false;
    if (currentPlayer === color && enemyCheckmateFields.length > 0) return true;

    const canKingBeDefendedVal = canKingBeDefended(board, color, enemyCheckmateFields);
    const canKingEatEnemyPieceVal = canKingEatEnemyPiece(board, color, king, enemyPieces);
    const canKingMoveOnEmptyFieldVal = canKingMoveOnEmptyField(board, color, king, emptyFields);

    return !canKingMoveOnEmptyFieldVal && canKingBeDefendedVal && canKingEatEnemyPieceVal;
}

export const checkIfCheckmate = (...args) => {

    return {
        checkmateWhite: isCheckmate(...args, "white") && "White",
        checkmateBlack: isCheckmate(...args, "black") && "Black",
    }
}

// Check if there are any pawns on last row for selected user, if true show modal in which user can select piece to return to board
export function checkIfPawnOnLastRow(mainStore, board, currentPlayer, pawnChangeModal) {
    const pawnOnLastRow = board[currentPlayer === "white" ? 7 : 0].find(field => field.piece && field.piece.name === "pawn");

    if (pawnOnLastRow) {
        const removedPieces = mainStore[pawnOnLastRow.piece.color + "RemovedPieces"];
        const onReturnPieceToField = (p) => {
            mainStore[pawnOnLastRow.piece.color + "RemovedPieces"] = [...removedPieces.slice(0, removedPieces.indexOf(p)), ...removedPieces.slice(removedPieces.indexOf(p) + 1)];
        }

        if (removedPieces.length > 0 && removedPieces.some(piece => piece.name !== "pawn")) {
            pawnChangeModal.open(
                removedPieces, 
                pawnOnLastRow, 
                (p) => onReturnPieceToField(p))
        } else {
            pawnOnLastRow.piece = null;
        }
    }
}

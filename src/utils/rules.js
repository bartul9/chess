import { cloneDeep } from "lodash";


export const getFieldRowAndColumnIndex = (field) => [field[0] - 1, field[1] - 1];

export const getAllFieldsWithPieces = (board) => board.map(row => row.filter(field => field.piece)).flat();

// Returns directions and number of steps in which selected piece can move
const getRules = (board, selectedField, kingsFields) => {
    const { piece: { color, name, steps }, field } = selectedField;

    const isWhite = color === "white";

    const [ row, column ] = getFieldRowAndColumnIndex(String(field));

    const rules = {
        pawn: {
            get path() {

                let maxSteps  = !steps ? 2 : 1;

                // Pawn has additional calculations because it can move on additional fields only if enemy piece exists on those fields
                const canAttackCheck = (n1, n2, isAttack = true) => {
                    const nextRow = row + n1;
                    const nextColumn = column + n2;

                    // If next row or column is beyond border return
                    if (nextRow <= -1 || nextRow >= 8) return 0; 
                    if (nextColumn <= -1 || nextColumn >= 8) return 0;

                    const nextField = board[nextRow][nextColumn];

                    // If pawn is on first step and it's not attacking direction and there are no enemy pawns on path, 
                    // pawn can move one or two fields forward depending if it is it's first or second move
                    if (!steps && !isAttack && !nextField.piece) {
                        const nextNextField = board[nextRow + n1][nextColumn + n2];
                        maxSteps = !nextNextField.piece ? 2 : 1;
                        return [n1, n2];
                    }

                    // If it is calculation for attacking king, and available fields in which king can move includes next field in which pawn can move return that next field
                    if (isAttack && kingsFields && kingsFields.includes(nextField)) {
                        return [n1, n2]
                    }

                    return ((isAttack && nextField.piece && nextField.piece.color !== color) || (!isAttack && !nextField.piece)) ? [n1, n2] : 0;
                }

                return [isWhite ? [[ 0, 0, 0 ], [ 0, field, 0 ], [canAttackCheck(1, -1), canAttackCheck(1, 0, false), canAttackCheck(1, 1)]] : [
                    [ canAttackCheck(-1, -1), canAttackCheck(-1, 0, false), canAttackCheck(-1, 1)],
                    [ 0, field, 0 ],
                    [ 0, 0, 0 ]
                ], maxSteps];
            }
        },
        rook: {
            get path() {
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
            get path() {
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
            get path() {
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
            get path() {
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
            get path() {
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

    return rules[name].path;
};

export const calculateAvailablePath = (board, field, returnKingFields, enemyPieces, canPathBeBlocked) => {
    const [ path, maxSteps ] = getRules(board, field);
    const [ row, column ] = getFieldRowAndColumnIndex(String(field.field));

    const calculatedData = {
        kingFields: [],
        defendingPieces: [],
        canPathBeBlocked: []
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
                                calculatedData.defendingPieces.push({ attacking: nextField, defending: field });
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
                        calculatedData.canPathBeBlocked.push({ checkmateField: nextField, defending: field });
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

// Move selected piece to selected field, if there is enemy piece on that field remove it from board
export const moveTo = (board, oldField, newField, skipStepsAdd = true) => {
    const [ newFieldRow, newFieldColumn ] = getFieldRowAndColumnIndex(String(newField.field));
    const [ oldFieldRow, oldFieldColumn ] = getFieldRowAndColumnIndex(String(oldField.field));

    let removedPiece;

    if (newField.canAttack) {
        removedPiece = newField.piece;
    }

    if (!skipStepsAdd) {
        oldField.piece.steps += 1
    }

    board[newFieldRow][newFieldColumn].piece = oldField.piece;
    board[oldFieldRow][oldFieldColumn].piece = null;

    return removedPiece;
};

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

const canKingBeDefended = (board, color, enemyCheckmateFields) => {

    // Get all friendly pieces that can attack or get in path of attacking enemy piece
    const canBeDefended = board.map(row => row.filter(({ piece }) => piece != null && piece.color === color && piece.name !== "king")).flat().reduce((acc, field) => {

        const { defendingPieces, canPathBeBlocked } = calculateAvailablePath(board, field, null, enemyCheckmateFields, true);

        defendingPieces && acc.defenders.push(...defendingPieces);
        canPathBeBlocked && acc.pathBlocking.push(...canPathBeBlocked)

        return acc;
    }, { defenders: [], pathBlocking: [] });

    // If there are friendly pieces that can attack enemy pieces that have checkmate on friendly king, calculate if it will still be checkmate after that piece is removed
    if (canBeDefended.defenders.length > 0) {

        canBeDefended.defenders = canBeDefended.defenders.map(item => {
            const { attacking, defending } = item;
            const newBoard = cloneDeep(board);

            moveTo(newBoard, defending, attacking);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    // If there are friendly pieces that can block path of attacking piece calculate if it will still be checkmate after path of attacking piece is blocked by friendly piece
    if (canBeDefended.pathBlocking.length > 0) {

        canBeDefended.pathBlocking = canBeDefended.pathBlocking.map(item => {
            const { checkmateField, defending } = item;
            const newBoard = cloneDeep(board);

            moveTo(newBoard, defending, checkmateField);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    const defendingPossible = canBeDefended.defenders.length > 0 && canBeDefended.defenders.every(i => i === false);
    const blockingPathPossible = canBeDefended.pathBlocking.length > 0 && canBeDefended.pathBlocking.every(i => i === false);

    return !defendingPossible && !blockingPathPossible;
}

const canKingEatEnemyPiece = (board, color, king, enemyPieces) => {
    // Get all enemy pieces that can attack king
    const { defendingPieces } = calculateAvailablePath(board, king, null, enemyPieces);

    let attackingPieces = defendingPieces;

    if (attackingPieces.length > 0) {

        // For every attacking piece that is on field on which king can move, do calculation if it will stil be checkmate after king moves on that field
        attackingPieces = attackingPieces.map(item => {
            // Attacking piece is king, and defending piece is enemy piece which king can attack
            const { attacking, defending } = item;
            const newBoard = cloneDeep(board);

            // Move king to field where is attacking piece and do calculation if it will still be checkmate after king eats that piece
            moveTo(newBoard, defending, attacking);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    return attackingPieces.length > 0 && attackingPieces.every(i => i === false);
}

const kingCantMoveOnEmptyFieldCheck = (board, color, king, emptyFields) => {
    const checkmateFieldName = color === "white" ? "checkmateWhite" : "checkmateBlack";
    const checkmatePathName = color === "white" ? "checkmatePathWhite" : "checkmatePathBlack";

    // If there are no empty fields on which king can move or all empty fields are marked as checkmate fields ( which means that those fields are on path of enemies pieces) return true
    if (emptyFields.length === 0) return true;
    if (emptyFields.length > 0 && emptyFields.every(field => field[checkmateFieldName] || field[checkmatePathName])) return true;

    // Available fields are all empty fields on which king can move that means all fields around king that are not on enemies path and that have no friendly or enemy pieces on it
    let availableFields = emptyFields.filter(field => !field[checkmateFieldName] && !field[checkmatePathName]);

    // If there are available fields on which king can move we have to calculate if it will still be checkmate after king moves on one of those fields
    if (availableFields.length > 0) {

        // For every available field on which king can move make check what will happen after king moves on that field, if king cam move on empty field, and there are no enemy pieces 
        // that have checkmate on king after king moves, it means it is not checkmate anymore
        availableFields = availableFields.map(field => {
            const newBoard = cloneDeep(board);

            moveTo(newBoard, king, field);
            const fieldsWithPieces = getAllFieldsWithPieces(newBoard);

            const { enemyCheckmateFields } = calculatePossibleCheckmate(newBoard, fieldsWithPieces, color);
            return enemyCheckmateFields.length > 0;
        })
    } 

    return availableFields.every(i => i === true);
}

const isCheckmate = (board, currentPlayer, color) => {
        
    const fieldsWithPieces = getAllFieldsWithPieces(board);

    const { kingFields, enemyCheckmateFields } = calculatePossibleCheckmate(board, fieldsWithPieces, color);

    const emptyFields = kingFields.filter(field => !field.piece); // Get all empty fields on which king can move
    const enemyPieces = kingFields.filter(field => field.piece && field.piece.color !== color); // Get all enemy pieces on fields on which king can move
    const king = fieldsWithPieces.find(({ piece }) => piece.name === "king" && piece.color === color);

    if (enemyCheckmateFields.length === 0) return false; // If there are no enemy pieces which can attack king, return checkmate == false
    if (currentPlayer === color && enemyCheckmateFields.length > 0) return true; // If there are enemey pieces that can attack king and it's enemies move, return checkmate == true

    // If it is our move, calculate if it will still be checkmate if king piece moves on another field, or check if king can be defended by friendly piece
    const kingCantBeDefended = canKingBeDefended(board, color, enemyCheckmateFields); 
    const kingCantEatEnemyPiece = canKingEatEnemyPiece(board, color, king, enemyPieces);
    const kingCantMoveOnEmptyField = kingCantMoveOnEmptyFieldCheck(board, color, king, emptyFields);

    return kingCantMoveOnEmptyField && kingCantBeDefended && kingCantEatEnemyPiece;
}

export const checkIfCheckmate = (...args) => {

    return {
        checkmateWhite: isCheckmate(...args, "white") && "White",
        checkmateBlack: isCheckmate(...args, "black") && "Black",
    }
}


const getFieldRowAndColumn = (field) => {
    return [field[0] - 1, field[1] - 1];
}

// Returns directions and number of steps in which selected piece can move
const getRules = (board, moves, selectedField, kingsFields) => {
    const { piece: { color, name }, field } = selectedField;

    const isWhite = color === "white";

    const [ row, column ] = getFieldRowAndColumn(String(field));

    const rules = {
        pawn: {
            getPath: () => {

                const canAttackCheck = (n1, n2, isAttack = true) => {
                    const nextRow = row + n1;
                    const nextColumn = column + n2;

                    // If next row or column is beyond border return
                    if (nextRow <= -1 || nextRow >= 8) return; 
                    if (nextColumn <= -1 || nextColumn >= 8) return;

                    const nextField = board[nextRow][nextColumn];

                    if (isAttack && nextField && kingsFields && kingsFields.includes(nextField)) {
                        return [n1, n2]
                    }

                    return ((isAttack && nextField && nextField.piece && nextField.piece.color !== color) || (!isAttack && !nextField.piece)) ? [n1, n2] : 0;
                }

                const path = 
                [
                    [ canAttackCheck(-1, -1), canAttackCheck(-1, 0, false), canAttackCheck(-1, 1)],
                    [ 0, field, 0 ],
                    [ 0, 0, 0 ]
                ];

                const maxSteps = moves == 0 ? 2 : 1; 

                return [isWhite ? [path[2], path[1], [canAttackCheck(1, -1), canAttackCheck(1, 0, false), canAttackCheck(1, 1)]] : path, maxSteps];
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

export const calculateAvailablePath = (board, moves, field, returnKingFields, enemyPieces) => {
    const [ path, maxSteps ] = getRules(board, moves, field);
    const [ row, column ] = getFieldRowAndColumn(String(field.field));

    const calculatedData = {
        kingFields: [],
        canPieceAttack: false
    }

    // Loop over path arrays and for every direction in which piece can move, repeat that move until available steps for selected piece are maxed out, or until path hits other piece or border
    path.forEach(arr => {
        // 0 means piece cant move in that direction
        if (arr.every(f => f == 0)) return;

        arr.forEach(c => {
            // c is array with two numbers representing direction in which piece can move, etc. [-1, -1] means current row - 1 and current column - 1
            if (typeof c === "object") {

                // Selected piece position
                let currentRow = row;
                let currentColumn = column;

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
                                calculatedData.canPieceAttack = true;
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

export const moveTo = (board, oldField, newField) => {
    const [ newFieldRow, newFieldColumn ] = getFieldRowAndColumn(String(newField.field));
    const [ oldFieldRow, oldFieldColumn ] = getFieldRowAndColumn(String(oldField.field));

    let removedPiece;

    if (newField.canAttack) {
        removedPiece = newField.piece;
    }

    board[newFieldRow][newFieldColumn].piece = oldField.piece;
    board[oldFieldRow][oldFieldColumn].piece = null;

    return removedPiece;
};

export const calculatePossibleCheckmate = (board, moves, fields) => {

    const clearCalculatedPath = (path) => {
        path.forEach(field => field.checkmateColor = null);
    }

    const checkIfCheckMate = (kingsFields, isCheckmate, color) => {
        const emptyFields = kingsFields.filter(field => !field.piece);
        const enemyPieces = kingsFields.filter(field => field.piece && field.piece.color !== color);
        const friendlyPieces = kingsFields.filter(field => field.piece && field.piece.color === color);

        const canFriendAttack = friendlyPieces.reduce((acc, field) => {
            const { canAttack } = calculateAvailablePath(board, moves, field, null, enemyPieces);
            canAttack && acc.push(canAttack);
            return acc;
        }, []);

        const emptyFieldsCheckmate = emptyFields.length > 0 ? emptyFields.every(field => field.checkmateColor) : true;

        return isCheckmate && emptyFieldsCheckmate && canFriendAttack.length === 0 && enemyPieces.length === 0;
    }

    const whiteKing = fields.find(({ piece: { name, color } }) => name === "king" && color === "white");
    const blackKing = fields.find(({ piece: { name, color } }) => name === "king" && color === "black");

    const { kingFields: whiteKingFields } = calculateAvailablePath(board, 1, whiteKing, true);
    const { kingFields: blackKingFields } = calculateAvailablePath(board, 1, blackKing, true);

    fields.forEach(field => {
        const kingsFields = field.piece.color === "white" ? blackKingFields : whiteKingFields;

        const checkmateColor = field.piece.color === "white" ? "black" : "white";

        const [ path, maxSteps ] = getRules(board, moves, field);
        const [ row, column ] = getFieldRowAndColumn(String(field.field));

        // Loop over path arrays and for every direction in which piece can move, repeat that move until available steps for selected piece are maxed out, or until path hits other piece or border
        path.forEach(arr => {

            arr.forEach(c => {
                // c is array with two numbers representing direction in which piece can move, etc. [-1, -1] means current row - 1 and current column - 1
                if (typeof c === "object") {

                    if (field.piece.name === "pawn" && arr.indexOf(c) === 1) return;

                    // Selected piece position
                    let currentRow = row;
                    let currentColumn = column;

                    let isCheckmate = false;

                    const calculatedPath = [];
                    const checkmateFields = [];

                    for (let step = 1; step <= maxSteps; step++) {
                        const nextRow = currentRow + c[0];
                        const nextColumn = currentColumn + c[1];

                        // If next row or column is beyond border return
                        if (nextRow <= -1 || nextRow >= 8) {
                            !isCheckmate && clearCalculatedPath([...calculatedPath]);
                            return;
                        } 
                        if (nextColumn <= -1 || nextColumn >= 8) {
                            !isCheckmate && clearCalculatedPath([...calculatedPath]);
                            return;
                        } 

                        const nextField = board[nextRow][nextColumn];

                        if (nextField.piece != null) {
                            const { color, name } = nextField.piece;

                            if (color !== field.piece.color && name === "king") {
                                nextField.checkmateColor = checkmateColor;
                                calculatedPath.push(nextField);
                                isCheckmate = true;
                                nextField.mustMoveKing = true;

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

                                    if (nextNextField && !nextNextField.piece && kingsFields.includes(nextNextField)) {
                                        nextNextField.checkmateColor = checkmateColor;
                                        checkmateFields.push(nextNextField);
                                        return;
                                    }
                                }
                            } else {
                                if (!isCheckmate) clearCalculatedPath([...calculatedPath]);
                                return;
                            }
                        }

                        if (kingsFields.includes(nextField)) {
                            nextField.checkmateColor = checkmateColor;
                            checkmateFields.push(nextField);
                        }

                        if (step == maxSteps && !isCheckmate) {
                            return clearCalculatedPath([...calculatedPath]);
                        }

                        if (!nextField.checkmateColor) {
                            nextField.checkmateColor = checkmateColor;
                            calculatedPath.push(nextField);
                        }
                        
                        currentRow = nextRow;
                        currentColumn = nextColumn;
                    }
                }
            })
        });
    })


    return {
        white: checkIfCheckMate(whiteKingFields, whiteKing.mustMoveKing, "white"),
        black: checkIfCheckMate(blackKingFields, blackKing.mustMoveKing, "black"),
    }
}

const getFieldRowAndColumn = (field) => {
    return [field[0] - 1, field[1] - 1];
}

// Returns directions and number of steps in which selected piece can move
const getRules = (board, selectedField) => {
    const { piece: { color, name }, field } = selectedField;

    const isWhite = color === "white";

    const [ row, column ] = getFieldRowAndColumn(String(field));

    const rules = {
        pawn: {
            getPath: () => {

                const canAttackCheck = (n1, n2, isAttack = true) => {
                    const nextField = board[row + n1][column + n2];
                    return ((isAttack && nextField && nextField.piece && nextField.piece.color !== color) || (!isAttack && !nextField.piece)) ? [n1, n2] : 0;
                }

                const isOnFirstFieldCheck = () => {
                    const [ row ] = getFieldRowAndColumn(String(field));
                    return (isWhite && row == 1) || (!isWhite && row == 6);
                }

                const path = 
                [
                    [ canAttackCheck(-1, -1), canAttackCheck(-1, 0, false), canAttackCheck(-1, 1)],
                    [ 0, field, 0 ],
                    [ 0, 0, 0 ]
                ];

                const maxSteps = isOnFirstFieldCheck() ? 2 : 1; 

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

export const calculateAvailablePath = (board, field) => {
    const [ path, maxSteps ] = getRules(board, field);
    const [ row, column ] = getFieldRowAndColumn(String(field.field));

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

                        if (color !== field.piece.color) {
                            nextField.canAttack = true;
                        }

                        return;
                    }

                    nextField.isAvailable = true;

                    currentRow = nextRow;
                    currentColumn = nextColumn;
                }
            }
        })

    });
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

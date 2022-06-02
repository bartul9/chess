
export const getRules = (board, moves, selectedField) => {
    const { piece: { color, name }, field } = selectedField;

    const isWhite = color === "white";

    const rules = {
        pawn: {
            getPath: () => {
                const path = 
                [
                    [ board.piece && [-1, -1], [-1, 0], board.piece && [-1, 1]],
                    [ 0, field, 0 ],
                    [ 0, 0, 0 ]
                ];

                const maxSteps = moves == 0 ? 2 : 1; 

                return [isWhite ? [path[2], path[1], [ board.piece && [1, -1], [1, 0], board.piece && [1, 1]]] : path, maxSteps];
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

export const calculateAvailablePath = (board, moves, field) => {
    const [ path, maxSteps ] = getRules(board, moves, field);
    const [ row, column ] = getSelectedFieldRowAndColumn(String(field.field));

    path.forEach(arr => {
        if (arr.every(f => f == 0)) return;

        arr.forEach(c => {
            if (typeof c === "object") {
                let currentRow = row;
                let currentColumn = column;

                for (let step = 1; step <= maxSteps; step++) {

                    if (currentRow + c[0] <= -1) return; 
                    if (currentRow + c[0] >= 8) return;
                    if (currentColumn + c[1] <= -1) return;
                    if (currentColumn + c[1] >= 8) return;

                    const currentField = board[currentRow + c[0]][currentColumn + c[1]];

                    if (currentField.piece != null) {
                        if (currentField.piece.color !== field.piece.color) {
                            currentField.canAttack = true;
                        }

                        step = maxSteps + 1;
                        return;
                    }

                    currentField.isAvailable = true;

                    currentRow = currentRow + c[0];
                    currentColumn = currentColumn + c[1];
                }
            }
        })

    });
}

export const moveTo = (board, oldField, newField) => {
    const { canAttack, isAvailable } = newField;
    const [ newFieldRow, newFieldColumn ] = getSelectedFieldRowAndColumn(String(newField.field));
    const [ oldFieldRow, oldFieldColumn ] = getSelectedFieldRowAndColumn(String(oldField.field));

    let removedPiece = null;

    if (canAttack) {
        removedPiece = newField.piece;
        board[newFieldRow][newFieldColumn].piece = oldField.piece;
        board[oldFieldRow][oldFieldColumn].piece = null;
    }

    if (isAvailable) {
        board[newFieldRow][newFieldColumn].piece = oldField.piece;
        board[oldFieldRow][oldFieldColumn].piece = null;
    }
    
    return removedPiece;
};


function getSelectedFieldRowAndColumn(field) {
    return [field[0] - 1, field[1] - 1];
}
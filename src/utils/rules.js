import { cloneDeep } from "lodash";


export const getFieldRowAndColumnIndex = (field) => [field[0] - 1, field[1] - 1];

export const getAllFieldsWithPieces = (board) => board.map(row => row.filter(field => field.piece)).flat();

const checkIfOutOfBound = (row, colum) => {
    if (row <= -1 || row >= 8) return true; 
    if (colum <= -1 || colum >= 8) return true;
}

// Path example with piece in middle
// [
//     [ [-1, -1], 0, [-1, 1] ],
//     [ 0, bishop, 0 ],
//     [ [1, -1], 0, [1, 1] ],
// ]

// Returns directions and number of steps in which selected piece can move
const getRules = (board, selectedField) => {
    const { piece: { color, name, steps }, field } = selectedField;

    const isWhite = color === "white";

    const [ row, column ] = getFieldRowAndColumnIndex(String(field));

    const rules = {
        pawn: {
            get path() {

                let maxSteps  = !steps ? 2 : 1;

                // Pawn has additional calculations because it can move on additional fields only if enemy piece exists on those fields
                const canAttackCheck = (r, c, isAttack = true) => {
                    const nextRow = row + r;
                    const nextColumn = column + c;

                    // If next row or column is beyond border return
                    if (checkIfOutOfBound(nextRow, nextColumn)) return 0;

                    const nextField = board[nextRow][nextColumn];

                    // If pawn is on first step and it's not attacking direction and there are no enemy pawns on path, 
                    // pawn can move one or two fields forward depending if it is it's first or second move
                    if (!steps && !isAttack && !nextField.piece) {
                        const nextNextField = board[nextRow + r][nextColumn + c];
                        maxSteps = !nextNextField.piece ? 2 : 1;
                        return [r, c];
                    }

                    return ((isAttack && nextField.piece && nextField.piece.color !== color) || (!isAttack && !nextField.piece)) ? [r, c] : 0;
                }

                return [isWhite ? 
                    [canAttackCheck(1, -1), canAttackCheck(1, 0, false), canAttackCheck(1, 1)] :
                    [canAttackCheck(-1, -1), canAttackCheck(-1, 0, false), canAttackCheck(-1, 1)], maxSteps];
            }
        },
        rook: {
            get path() {
                const path = 
                [
                    [-1, 0], [0, -1], [0, 1], [1, 0]
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        knight: {
            get path() {
                const path = 
                [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
                ];

                const maxSteps = 1;

                return [path, maxSteps];
            }
        },
        bishop: {
            get path() {
                const path =  
                [
                    [-1, -1], [-1, 1], [1, -1], [1, 1],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        queen: {
            get path() {
                const path = 
                [
                    [-1, -1], [1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [-1, 0], [1, 1],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        king: {
            get path() {
                const path = 
                [
                    [-1, -1], [1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [-1, 0], [1, 1],
                ];

                const maxSteps = 1;

                return [path, maxSteps];
            }
        }
    }

    return rules[name].path;
};

export const calculateAvailablePath = (board, field) => {
    const [ path, maxSteps ] = getRules(board, field);
    const [ row, column ] = getFieldRowAndColumnIndex(String(field.field));

    // Loop over path arrays and for every direction in which piece can move, repeat that move until available steps for selected piece are maxed out, or until path hits other piece or border
    path.forEach(arr => {
            
        // arr is array with two numbers representing direction in which piece can move, etc. [-1, -1] means current row - 1 and current column - 1
        if (typeof arr === "object") {
            // Selected piece position
            let currentRow = row;
            let currentColumn = column;

            for (let step = 1; step <= maxSteps; step++) {
                const nextRow = currentRow + arr[0];
                const nextColumn = currentColumn + arr[1];

                // If next row or column is beyond border return
                if (checkIfOutOfBound(nextRow, nextColumn)) return;

                const nextField = board[nextRow][nextColumn];

                if (nextField.piece != null) {
                    const { color } = nextField.piece;

                    if (color !== field.piece.color) {
                        nextField.canAttack = true;
                    }
                    break;
                }

                nextField.isAvailable = true;
                
                currentRow = nextRow;
                currentColumn = nextColumn;
            }
        }
    });
}

// Move selected piece to selected field, if there is enemy piece on that field remove it from board
export const moveTo = (board, oldField, newField) => {
    const [ newFieldRow, newFieldColumn ] = getFieldRowAndColumnIndex(String(newField.field));
    const [ oldFieldRow, oldFieldColumn ] = getFieldRowAndColumnIndex(String(oldField.field));

    oldField.piece.steps ++;

    let removedPiece;

    if (newField.canAttack) {
        removedPiece = newField.piece;
    }

    board[newFieldRow][newFieldColumn].piece = oldField.piece;
    board[oldFieldRow][oldFieldColumn].piece = null;

    return removedPiece;
};

// Check if there are any pawns on last row for selected user, if true show modal in which user can select piece to return to board
export function checkIfPawnOnLastRow(mainStore) {
    const { board, currentPlayer, pawnChangeModal } = mainStore;
    
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

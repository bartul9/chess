

export const moveTo = (board, currentField, nextField) => {

    const { piece } = currentField;


    // return calculateAvailablePath(board, currentField)
};


export const getRules = (board, moves, selectedField) => {
    const { piece: { color, name }, field } = selectedField;

    const isWhite = color === "white";

    const rules = {
        pawn: {
            getPath: () => {
                const path = 
                [
                    [ board.piece || 0, 1, board.piece || 0],
                    [ 0, field, 0 ],
                    [ 0, 0, 0 ]
                ];

                const maxSteps = moves == 0 ? 2 : 1; 

                return [!isWhite ? path : [path[2], path[1], path[0]], maxSteps];
            }
        },
        rook: {
            getPath: () => {
                const path = 
                [
                    [ 0, 1, 0 ],
                    [ 1, field, 1 ],
                    [ 0, 1, 0 ],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        knight: {
            getPath: () => {
                const path = 
                [
                    [ 0, 1, 0, 1, 0 ],
                    [ 1, 0, 0, 0, 1 ],
                    [ 0, 0, field, 0, 0 ],
                    [ 1, 0, 0, 0, 1 ],
                    [ 0, 1, 0, 1, 0 ],
                ];

                const maxSteps = 3;

                return [path, maxSteps];
            }
        },
        bishop: {
            getPath: () => {
                const path = 
                [
                    [ 1, 0, 1 ],
                    [ 0, field, 0 ],
                    [ 1, 0, 1 ],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        queen: {
            getPath: () => {
                const path = 
                [
                    [ 1, 1, 1 ],
                    [ 1, field, 1 ],
                    [ 1, 1, 1 ],
                ];

                const maxSteps = 7;

                return [path, maxSteps];
            }
        },
        king: {
            getPath: () => {
                const path = 
                [
                    [ 1, 1, 1 ],
                    [ 1, field, 1 ],
                    [ 1, 1, 1 ],
                ];

                const maxSteps = 1;

                return [path, maxSteps];
            }
        }
    }

    return rules[name].getPath();
};

export const calculateAvailablePath = (board, rules, field) => {
    const [ row, column ] = getSelectedFieldRowAndColumn(String(field));

    const [ path, maxSteps ] = rules;

    path.forEach((arr, ix)=> {
        let nextRows = [];

        if (!arr.includes(1)) return;


        // if (arr.includes(field)) maxSteps.forEach(step => board[row][column].isAvailable = true);
        if (path.length == 3 && ix < 1) {
            for (let step = 1; step <= maxSteps; step++) {
                board[row - (step * 1)][column].isAvailable = true;
            }
        } 

        if (path.length == 3 && ix > 1) {
            for (let step = 1; step <= maxSteps; step++) {
                board[row + (step * 1)][column].isAvailable = true;
            }
        }
        // if (path.length == 3 && ix < 1) maxSteps.forEach(step => board[row - (step * 100)][column].isAvailable = true);

    })
    debugger
}

function getSelectedFieldRowAndColumn(field) {
    return [field[0] - 1, field[1] - 1];
}
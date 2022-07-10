


import { cloneDeep } from "lodash";

import { getAllFieldsWithPieces, getFieldRowAndColumnIndex } from "./rules";

// board is array of arrays that contains objects representing every field on chessboard
// fields are marked with 3 numbers, first one is row, second one is column, and third one is color of the field, etc. 1 = white, 2 = black
export const board = [
    [
        { field: 111, piece: { name: "rook", color: "white", stepsTaken: 0 } }, 
        { field: 122, piece: { name: "knight", color: "white", stepsTaken: 0 } }, 
        { field: 131, piece: { name: "bishop", color: "white", stepsTaken: 0 } }, 
        { field: 142, piece: { name: "queen", color: "white", stepsTaken: 0 } }, 
        { field: 151, piece: { name: "king", color: "white", stepsTaken: 0 } }, 
        { field: 162, piece: { name: "bishop", color: "white", stepsTaken: 0 } }, 
        { field: 171, piece: { name: "knight", color: "white", stepsTaken: 0 } }, 
        { field: 182, piece: { name: "rook", color: "white", stepsTaken: 0 } }
    ],
    [
        { field: 212, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 221, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 232, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 241, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 252, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 261, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 272, piece: { name: "pawn", color: "white", stepsTaken: 0 } }, 
        { field: 281, piece: { name: "pawn", color: "white", stepsTaken: 0 } }
    ],
    [
        { field: 311, piece: null }, 
        { field: 322, piece: null }, 
        { field: 331, piece: null }, 
        { field: 342, piece: null }, 
        { field: 351, piece: null }, 
        { field: 362, piece: null }, 
        { field: 371, piece: null }, 
        { field: 382, piece: null }
    ],
    [
        { field: 412, piece: null }, 
        { field: 421, piece: null }, 
        { field: 432, piece: null }, 
        { field: 441, piece: null }, 
        { field: 452, piece: null }, 
        { field: 461, piece: null }, 
        { field: 472, piece: null }, 
        { field: 481, piece: null }
    ],
    [
        { field: 511, piece: null }, 
        { field: 522, piece: null }, 
        { field: 531, piece: null }, 
        { field: 542, piece: null }, 
        { field: 551, piece: null }, 
        { field: 562, piece: null }, 
        { field: 571, piece: null },
        { field: 582, piece: null }
    ],
    [
        { field: 612, piece: null }, 
        { field: 621, piece: null }, 
        { field: 632, piece: null }, 
        { field: 641, piece: null }, 
        { field: 652, piece: null }, 
        { field: 661, piece: null }, 
        { field: 672, piece: null }, 
        { field: 681, piece: null }
    ],
    [
        { field: 711, piece: { name: "pawn", color: "black", stepsTaken: 0 } }, 
        { field: 722, piece: { name: "pawn", color: "black", stepsTaken: 0 } },
        { field: 731, piece: { name: "pawn", color: "black", stepsTaken: 0 } }, 
        { field: 742, piece: { name: "pawn", color: "black", stepsTaken: 0 } }, 
        { field: 751, piece: { name: "pawn", color: "black", stepsTaken: 0 } }, 
        { field: 762, piece: { name: "pawn", color: "black", stepsTaken: 0 } }, 
        { field: 771, piece: { name: "pawn", color: "black", stepsTaken: 0 } }, 
        { field: 782, piece: { name: "pawn", color: "black", stepsTaken: 0 } }
    ],
    [
        { field: 812, piece: { name: "rook", color: "black", stepsTaken: 0 } }, 
        { field: 821, piece: { name: "knight", color: "black", stepsTaken: 0 } }, 
        { field: 832, piece: { name: "bishop", color: "black", stepsTaken: 0 } }, 
        { field: 841, piece: { name: "queen", color: "black", stepsTaken: 0 } }, 
        { field: 852, piece: { name: "king", color: "black", stepsTaken: 0 } }, 
        { field: 861, piece: { name: "bishop", color: "black", stepsTaken: 0 } }, 
        { field: 872, piece: { name: "knight", color: "black", stepsTaken: 0 } }, 
        { field: 881, piece: { name: "rook", color: "black", stepsTaken: 0 } }
    ]
];     

// Randomly sets pieces on board
export const randomizeBoard = () => {
    const newBoard = cloneDeep(board);

    // Get all pieces but remove pawns
    const pieces = getAllFieldsWithPieces(newBoard).map(field => field.piece).filter(piece => piece.name !== "pawn");

    // Set all fields to be empty
    newBoard.forEach(row => row.forEach(field => field.piece = null));

    const fields = newBoard.map(row => row.map(field => field.field)).flat();

    // Randomize all fields so they are not in order from lowest to highest
    const randomFields = fields.reduce(acc => {
        const randomIndex = Math.ceil(Math.random() * fields.length - 1);
        
        acc.push(fields[randomIndex]);
        fields.splice(randomIndex, 1);

        return acc;
    }, []);

    // With all pieces randomized we can loop over fields array and set new piece to each field
    randomFields.forEach(randomField => {
        const [row, column] = getFieldRowAndColumnIndex(String(randomField));
        newBoard[row][column].piece = pieces[0];
        pieces.shift();
    });

    return newBoard;
}

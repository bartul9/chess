

// board is array of arrays that contains objects representing every field on chessboard
// fields are marked with 3 numbers, first one is row, second one is column, and third one is color of the field, etc. 1 = white, 2 = black
export const board = [
    [
        { field: 111, piece: { name: "rook", color: "white" } }, 
        { field: 122, piece: { name: "knight", color: "white" } }, 
        { field: 131, piece: { name: "bishop", color: "white" } }, 
        { field: 142, piece: { name: "queen", color: "white" } }, 
        { field: 151, piece: { name: "king", color: "white" } }, 
        { field: 162, piece: { name: "bishop", color: "white" } }, 
        { field: 171, piece: { name: "knight", color: "white" } }, 
        { field: 182, piece: { name: "rook", color: "white" } }
    ],
    [
        { field: 212, piece: { name: "pawn", color: "white" } }, 
        { field: 221, piece: { name: "pawn", color: "white" } }, 
        { field: 232, piece: { name: "pawn", color: "white" } }, 
        { field: 241, piece: { name: "pawn", color: "white" } }, 
        { field: 252, piece: { name: "pawn", color: "white" } }, 
        { field: 261, piece: { name: "pawn", color: "white" } }, 
        { field: 272, piece: { name: "pawn", color: "white" } }, 
        { field: 281, piece: { name: "pawn", color: "white" } }
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
        { field: 711, piece: { name: "pawn", color: "black" } }, 
        { field: 722, piece: { name: "pawn", color: "black" } },
        { field: 731, piece: { name: "pawn", color: "black" } }, 
        { field: 742, piece: { name: "pawn", color: "black" } }, 
        { field: 751, piece: { name: "pawn", color: "black" } }, 
        { field: 762, piece: { name: "pawn", color: "black" } }, 
        { field: 771, piece: { name: "pawn", color: "black" } }, 
        { field: 782, piece: { name: "pawn", color: "black" } }
    ],
    [
        { field: 812, piece: { name: "rook", color: "black" } }, 
        { field: 821, piece: { name: "knight", color: "black" } }, 
        { field: 832, piece: { name: "bishop", color: "black" } }, 
        { field: 841, piece: { name: "queen", color: "black" } }, 
        { field: 852, piece: { name: "king", color: "black" } }, 
        { field: 861, piece: { name: "bishop", color: "black" } }, 
        { field: 872, piece: { name: "knight", color: "black" } }, 
        { field: 881, piece: { name: "rook", color: "black" } }
    ]
]; 




// export const board = [
//     [
//         { field: 111, piece: { name: "rook", color: "white" } }, 
//         { field: 122, piece: { name: "knight", color: "white" } }, 
//         { field: 131, piece: { name: "bishop", color: "white" } }, 
//         { field: 142, piece: { name: "queen", color: "white" } }, 
//         { field: 151, piece: null }, 
//         { field: 162, piece: { name: "bishop", color: "white" } }, 
//         { field: 171, piece: { name: "knight", color: "white" } }, 
//         { field: 182, piece: { name: "rook", color: "white" } }
//     ],
//     [
//         { field: 212, piece: { name: "pawn", color: "white" } }, 
//         { field: 221, piece: { name: "pawn", color: "white" } }, 
//         { field: 232, piece: { name: "pawn", color: "white" } }, 
//         { field: 241, piece: { name: "pawn", color: "white" } }, 
//         { field: 252, piece: { name: "pawn", color: "white" } }, 
//         { field: 261, piece: { name: "pawn", color: "white" } }, 
//         { field: 272, piece: { name: "pawn", color: "white" } }, 
//         { field: 281, piece: { name: "pawn", color: "white" } }
//     ],
//     [
//         { field: 311, piece: null }, 
//         { field: 322, piece: null }, 
//         { field: 331, piece: null }, 
//         { field: 342, piece: null }, 
//         { field: 351, piece: null }, 
//         { field: 362, piece: null }, 
//         { field: 371, piece: null }, 
//         { field: 382, piece: null }
//     ],
//     [
//         { field: 412, piece: null }, 
//         { field: 421, piece: null }, 
//         { field: 432, piece: null }, 
//         { field: 441, piece: null }, 
//         { field: 452, piece: null }, 
//         { field: 461, piece: { name: "queen", color: "black" } }, 
//         { field: 472, piece: null }, 
//         { field: 481, piece: null }
//     ],
//     [
//         { field: 511, piece: { name: "rook", color: "black" } }, 
//         { field: 522, piece: null }, 
//         { field: 531, piece: null }, 
//         { field: 542, piece: { name: "king", color: "white" } }, 
//         { field: 551, piece: null }, 
//         { field: 562, piece: null }, 
//         { field: 571, piece: null },
//         { field: 582, piece: null }
//     ],
//     [
//         { field: 612, piece: null }, 
//         { field: 621, piece: { name: "knight", color: "black" } }, 
//         { field: 632, piece: null }, 
//         { field: 641, piece: null }, 
//         { field: 652, piece: null }, 
//         { field: 661, piece: null }, 
//         { field: 672, piece: null }, 
//         { field: 681, piece: { name: "rook", color: "black" } }
//     ],
//     [
//         { field: 711, piece: { name: "pawn", color: "black" } }, 
//         { field: 722, piece: { name: "pawn", color: "black" } },
//         { field: 731, piece: { name: "pawn", color: "black" } }, 
//         { field: 742, piece: { name: "pawn", color: "black" } }, 
//         { field: 751, piece: { name: "pawn", color: "black" } }, 
//         { field: 762, piece: { name: "pawn", color: "black" } }, 
//         { field: 771, piece: { name: "pawn", color: "black" } }, 
//         { field: 782, piece: { name: "pawn", color: "black" } }
//     ],
//     [
//         { field: 812, piece: null }, 
//         { field: 821, piece: null }, 
//         { field: 832, piece: { name: "bishop", color: "black" } }, 
//         { field: 841, piece: null }, 
//         { field: 852, piece: { name: "king", color: "black" } }, 
//         { field: 861, piece: { name: "bishop", color: "black" } }, 
//         { field: 872, piece: { name: "knight", color: "black" } }, 
//         { field: 881, piece: null }
//     ]
// ]; 
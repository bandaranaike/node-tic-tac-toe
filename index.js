const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors")

const fs = require("fs")

const { readDBFile, writeDBFile } = require("./database")

app.use(express.json());

// Handling CORS
app.use(cors())

// Initial game value
const initialSquares = [{ squares: Array(9).fill(null) }];

/**
 * Get the data update request
 */
app.put("/api/update-data", async function (req, res) {

    let i = req.body.square;
    let xIsNext = req.body.xIsNext;
    let data = await updateHistory(i, xIsNext);

    res.json({ success: true, data })
})

/**
 * Get the game reset request
 */
app.post("/api/reset-game", (req, res) => {
    writeDBFile(initialSquares);
    const data = {
        history: initialSquares,
        xIsNext: true,
        winner: null
    }
    res.json(data)
})

/**
 * Initialize the port
 */
app.listen(PORT, () => {
    console.log("Welcome to the tic-tac-toe node js app")
});

/**
 * Get the history from json file and update with new value and store it again
 * 
 * @param string i 
 * @param boolean xIsNext 
 * @returns object
 */
async function updateHistory(i, xIsNext) {

    let history;
    await readDBFile().then(r => {
        history = r;
    });

    // The latest one is current one
    const current = history[history.length - 1];

    // Creating new one by copying the previous one
    const squares = current.squares.slice();

    // Replacing new value in the new array
    squares[i] = xIsNext ? 'X' : 'O';

    // Concatinating the history and new record
    history = history.concat([{ squares: squares, }])

    let winner = await calculateWinner(squares, history);

    const data = {
        history: history,
        xIsNext: !xIsNext,
        winner
    }

    writeDBFile(history);

    return data;

}

/**
 * If the current user has entered same symbol in a row, winner is current user.
 * 
 * @param Array squares 
 * @param Array history 
 * @returns 
 */
async function calculateWinner(squares, history) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {

        // A single row
        const [a, b, c] = lines[i];

        // Checking whether same charactors in a single row or not
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }

    // User has entered all 9 charactors already.
    if (history.length === 10) {
        return "over";
    }

    return null;
}

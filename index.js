const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors")

const fs = require("fs")

app.use(express.json());

// Handling CORS
app.use(cors())

const initialSquares = [{ squares: Array(9).fill(null) }];

app.put("/api/update-data", async function (req, res) {

    let i = req.body.square;
    let xIsNext = req.body.xIsNext;
    let data = await updateHistory(i, xIsNext);

    res.json({ success: true, data })
})

app.post("/api/reset-game", (req, res) => {
    writeDBFile(initialSquares);
    const data = {
        history: initialSquares,
        xIsNext: true,
        winner: null
    }
    res.json(data)
})

async function timeOutOne() {
    const data = {
        history: Array(9).fill(null),
        xIsNext: true,
        winner: null
    }
    return new Promise(r => setTimeout(() => r(data), 100))
}

app.listen(PORT, () => {
    console.log("Welcome to the tic-tac-toe node js app")
});

async function updateHistory(i, xIsNext) {
    let history;

    await readDBFile().then(r => {
        history = r;
    });


    const current = history[history.length - 1];
    const squares = current.squares.slice();

    squares[i] = xIsNext ? 'X' : 'O';

    history = history.concat([{ squares: squares, }])

    let winner = await calculateWinner(squares);

    const data = {
        history: history,
        xIsNext: !xIsNext,
        winner
    }

    writeDBFile(history);

    return data;

}

async function readDBFile() {
    return new Promise((rs, rj) => {
        fs.readFile('steps.json', (err, data) => {
            if (err) throw err;
            let history;
            try {
                history = JSON.parse(data)
            } catch (e) {
                history = initialSquares;
            }
            rs(history)
        });
    })
}

async function writeDBFile(history) {
    let data = JSON.stringify(history);
    fs.writeFileSync('steps.json', data);
}


async function calculateWinner(squares) {
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
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null;
}

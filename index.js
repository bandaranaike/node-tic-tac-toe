const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors")

const fs = require("fs")

let student = {
    name: 'Mike',
    age: 23,
    gender: 'Male',
    department: 'English',
    car: 'Honda'
};



app.use(express.json());

// Handling CORS
app.use(cors())





// app.get("/api", (req, res) => {
//     return res.json({ message: "Hello from the tic-tac-toe server" })
// })

app.get("/api/initial-data", async (req, res) => {
    const data = {
        history: [{ squares: Array(9).fill(null) }],
        xIsNext: true,
        winner: null
    }
    res.json(data)
})


app.put("/api/update-data", function (req, res) {

    let i = req.body.square;
    let xIsNext = req.body.xIsNext;
    updateHistory(req, i, xIsNext);

    res.json({ success: true, data: req.body })
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


function getHistory(req) {
    req.session.history = [{ squares: Array(9).fill(null) }]
}


async function updateHistory(req, i, xIsNext) {
    let history;

    await readDBFile().then(r => {
        history = r;
    });

    history = history || [{ squares: Array(9).fill(null) }];

    const current = history[history.length - 1];
    const squares = current.squares.slice();

    squares[i] = xIsNext ? 'X' : 'O';

    history = history.concat([{ squares: squares, }])

    let data = JSON.stringify(history);
    fs.writeFileSync('steps.json', data);

}

async function readDBFile() {
    return new Promise((rs, rj) => {
        fs.readFile('steps.json', (err, data) => {
            if (err) throw err;
            let history;
            try {
                history = JSON.parse(data)
            } catch (e) {
                history = [{ squares: Array(9).fill(null) }];
            }
            rs(history)
        });
    })
}




function calculateWinner(squares) {
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

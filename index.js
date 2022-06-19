const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors")

// Handling CORS
app.use(cors())


app.get("/api", (req, res) => {
    return res.json({ message: "Hello from the tic-tac-toe server" })
})

app.get("/api/history/get", async (req, res) => {
    let history = await timeOutOne();
    res.json({ history })
})

async function timeOutOne() {
    const data = {
        history:Array(9).fill(null)
    }
    return new Promise(r => setTimeout(() => r(), 100))
}

app.patch("/api/history/update-state", (req, res) => {
    return
})

app.listen(PORT, () => {
    console.log("Welcome to the tic-tac-toe node js app")
});


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

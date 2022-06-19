const fs = require("fs")


/**
 * Read the json file content and return data
 * 
 * @returns Promise
 */
const readDBFile = async () => {
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

/**
 * Write updated data to the json file
 * 
 * @param {*} history 
 */
const writeDBFile = async (history) => {
    let data = JSON.stringify(history);
    fs.writeFileSync('steps.json', data);
}

module.exports = { readDBFile, writeDBFile }
const fs = require("fs")

const loggerRequest = (filename) => {
    return (req, res, next) => {
        fs.appendFileSync(filename, `${req.method} ${req.url} ${new Date().toISOString()}\n`)
        next();
    }
}

module.exports = loggerRequest;



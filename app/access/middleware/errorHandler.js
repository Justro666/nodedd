const { logEvents } = require('./logger')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err?.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    const status = res.statusCode ? res.statusCode : 500 // server error 
    res.status(status)
    res.json({ message: err.message, is_error: true })
}

module.exports = errorHandler 
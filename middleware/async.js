//if "express-async-errors" module won't work

module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res)
        } catch (error) {
            //log exception
            // res.status(500).send('Something failed.');
            next(error)
        }
    }

}
const winston = require('winston');


module.exports = async function (err, req, res, next) {
    //winston.log('error', err)
    await winston.error(err);
    //error
    //warn
    //info
    //verbose
    //debug
    //silly

    res.status(500).send('Something failed.');
    next();
}
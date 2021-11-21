const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
module.exports = function () {

    // process.on('uncaughtException', (ex) => {
    //   // console.log("uncaughtException");
    //   winston.error(ex.message);
    //   process.exit(1);
    // })
    // winston.ExceptionHandler

    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtException.log' }),
        new winston.transports.Console({
            level: 'info',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
        })
    )

    process.on('unhandledRejection', (ex) => {
        // console.log("unhandledRejection");
        // winston.error(ex.message);
        throw ex;

    })


    // winston.add(new winston.transports.File({ filename: 'logfile.log' }), { 'timestamp': true });
    function timezoned() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} T ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
    }





    winston.add(winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp({ format: timezoned }),
            winston.format.json()
        ),

        defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            //
            new winston.transports.File({ filename: 'logfile.log' }),
            new winston.transports.MongoDB({
                db: "mongodb://localhost:27017/vidly", options: { useNewUrlParser: true, useUnifiedTopology: true }, storeHost: true,
                capped: true,
            })
        ],
    }));

    // winston.add(new winston.transports.MongoDB({ db: "mongodb://localhost:27017/vidly", options: { useNewUrlParser: true, useUnifiedTopology: true } }))


    // throw new Error('Something failed');

    // const p = Promise.reject(new Error('miserable error.'));
    // p.then(() => console.log('Done'))


}
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const config = require('config');
const startUpDebugger = require('debug')('app:startUp');
const dbDebugger = require('debug')('app:db');
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const home = require('./routes/home')
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet())
// app.use(logger);
app.set('view engine', 'pug');
app.set('views', './views') //default
console.log(app.get('env'));
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startUpDebugger('Morgan enabled')
}
app.use('/api/genres', genres)
app.use('/', home)


app.listen(PORT, () => console.log(`Listening to port ${PORT}...`))
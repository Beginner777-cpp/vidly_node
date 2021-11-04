const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const config = require('config');
const startUpDebugger = require('debug')('app:startUp');
const dbDebugger = require('debug')('app:db');
const logger = require('./logger');
const genres = require('./routes/genres');
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet())
app.use(logger);
app.use('/api/genres', genres)
app.set('view engine', 'pug');
// app.set('views', './views')
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startUpDebugger('Morgan enabled')
}


app.get('/', (req, res) => {
    res.render('index', { title: 'My Express router', message: 'Hello Express' })
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`))
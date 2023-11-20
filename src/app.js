require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const morgan = require('morgan');

const { checkOverload } = require('./helpers/check.connect');

const app = express();
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

console.log('Process', process.env);

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use('/api/', apiLimiter);

// init db
require('./dbs/init.mongodb');

// checkOverload();
// init routes
app.use('', require('./routes'))
// handling error

module.exports = app;
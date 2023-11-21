require('dotenv').config();
const { checkOverload } = require('./helpers/check.connect');
const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

console.log('Process', process.env);

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use('/api/', apiLimiter);

// init db
require('./dbs/init.mongodb');

// checkOverload();
// init routes
app.use('/', require('./routes'));
// handling error

module.exports = app;
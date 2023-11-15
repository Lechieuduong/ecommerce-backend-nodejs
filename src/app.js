const express = require('express');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(morgan('dev'));
// init db

// init routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Welcome'
    })
})
// handling error

module.exports = app;
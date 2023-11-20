'use strict'

const { default: mongoose } = require("mongoose");

const connetString = 'mongodb://localhost:27017/shopDEV';
mongoose.connect(connetString).then( _ => console.log('Connect to Mongodb Success'))
.catch(err => console.log('Error connection!'));

// dev 
if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true })
}

module.exports = mongoose;
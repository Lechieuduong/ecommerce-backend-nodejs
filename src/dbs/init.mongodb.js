'use strict'

const { default: mongoose } = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const { db: { host, name, port }} = require('../configs/config.mongodb')
const connectString = `mongodb://localhost:27017/${name}`;

class Database {
    constructor () {
        this.connect()
    }
    // connect 
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50                      
        }).then( _ => {
            console.log(`connectionString: ${connectString}`);
            console.log('Connect to Mongodb Success Pro', countConnect());
        })
        .catch(err => console.log('Error connection!'));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
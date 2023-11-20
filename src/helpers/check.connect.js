'use strict'

const { default: mongoose } = require("mongoose");
const os = require('os');
const process = require('process');
const _SECONDS = 5000;
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections: ${numConnection}`);
}
// check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().lengh;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connection based on number of cores
        const maxConnection = numCores * 5;

        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnection > maxConnection) {
            console.log('Connection overload detected!');
            //notify.send(....)
        }
    }, _SECONDS)
}

module.exports = {
    countConnect,
    checkOverload
}
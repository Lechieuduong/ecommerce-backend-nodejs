'use strict';

const _ = require('lodash');

const getInfoData = ({fields = [], objects = {}}) => {
    return _.pick(objects, fields)
}

module.exports = {
    getInfoData
}
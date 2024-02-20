const express = require('express');
const { apiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(apiKey);
// check permissions
router.use(checkPermission('0000'));

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))


module.exports = router;
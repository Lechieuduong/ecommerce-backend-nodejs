const express = require('express');
const accessController = require('../../controllers/access.controller');
const { assignHandler } = require('../../auth/checkAuth');
const router = express.Router();

// signUp
router.post('/shop/sign-up', assignHandler(accessController.signUp))

module.exports = router;
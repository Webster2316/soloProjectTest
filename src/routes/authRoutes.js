const express = require("express");
const router = express.Router();


//authorisation/creation/session

const authController = require('../controllers/auth.controller');

router.get('/session', authController.getSession);
router.post('/users', authController.createUser); // account creation


//to transfer account/session
const transferController = require('../controllers/transferController');

router.post('/generate', transferController.generateTransferCode);
router.post('/redeem', transferController.redeemTransferCode);

module.exports = router;

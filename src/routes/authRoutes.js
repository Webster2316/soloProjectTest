const express = require("express");
const router = express.Router();


//authorisation/creation/session

const authController = require('../controllers/auth.controller');

router.get('/session', authController.getSession);
router.post('/users', authController.createUser); // account creation

module.exports = router;
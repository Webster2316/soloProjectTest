const express = require("express");
const router = express.Router();

//user
const userController = require("../controllers/userController");

router.get('/me', userController.getUser);
router.patch('/me', userController.updateUser);
router.delete('/me', userController.deleteUser);

router.post('/grantDaily', userController.grantDailyTransmissions);


module.exports = router;

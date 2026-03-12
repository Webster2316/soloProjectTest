const express = require('express');
const router = express.Router();
const chatroomController = require('../controllers/chatroomController');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', authMiddleware, chatroomController.getMessages);
router.post('/', authMiddleware, chatroomController.postMessage);

module.exports = router;
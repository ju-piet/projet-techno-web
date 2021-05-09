const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller')
const verifTok = require('../services/token');


router.get('/',verifTok, userController.index);
router.post('/',verifTok, userController.create);
router.get('/:userEmail',verifTok, userController.showByEmail)
router.put('/:userId',verifTok, userController.update);
router.delete('/:userId',verifTok, userController.delete);
router.post('/login', userController.login);

module.exports = router;
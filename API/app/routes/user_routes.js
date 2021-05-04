const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller');

router.get('/', userController.index);
router.post('/', userController.create);
//router.get('/:userId', userController.show);
router.get('/:userEmail', userController.showByEmail)
router.put('/:userId', userController.update);
router.delete('/:userId', userController.delete);
router.post('/login', userController.login);

module.exports = router;
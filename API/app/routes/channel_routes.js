const express = require('express');
const router = express.Router();

const channelController = require('../controllers/channel_controller');

router.get('/', channelController.index);
router.post('/', channelController.create);
router.get('/:channelId/:userId', channelController.show);
router.put('/:channelId', channelController.update);
router.delete('/:channelId', channelController.delete);

module.exports = router;

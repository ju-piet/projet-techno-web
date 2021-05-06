const express = require('express');
const router = express.Router();


const channelController = require('../controllers/channel_controller');
const verifTok = require('../services/token');

router.use(verifTok)

router.get('/', channelController.index);
router.post('/', channelController.create);
router.get('/:channelId', channelController.show);
router.put('/:channelId', channelController.update);
router.delete('/:channelId', channelController.delete);

module.exports = router;

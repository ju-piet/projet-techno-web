const express = require('express');
const router = express.Router();

const messageController = require('../controllers/message_controller');
const verifTok = require('../services/token');

router.use(verifTok)

router.get('/channels/:channelId/messages', messageController.index);
router.post('/messages', messageController.create);
router.put('/messages/:messageId', messageController.update);
router.delete('/messages/:messageId', messageController.delete);

//On doit respecter la convention dans la conception !
//La ressource est message.
//La particularit√© se trouve uniquement dans la liste (car on veut faire par rapport √† un channel)

module.exports = router;

const {
    listAllMessages,
    createNewMessage,
    updateMessage,
    deleteMessage,
} = require('../models/message_model');
const {
    showChannel,
} = require('../models/channel_model');

exports.index = async (req, res) => {
    const channelId = req.params.channelId;
    const user = res.locals.token.user

    try {
        await showChannel(channelId, user);
    } catch({code, err}) {
        if(code === 404) {
            return res.status(404).json({message: 'resource_not_found'})
        }
        
        return res.status(500).json({message: err});
    }

    const messages = await listAllMessages(channelId);

    return res.status(200).json(messages);
};

exports.create = async (req, res) => {
    const body = req.body;

    //Blindage du body

    if(body) {

        if(! body.content) {
            return res.status(400).json({message: 'Le contenu du message est obligatoire.'});
        }
        if(! body.author) {
            return res.status(400).json({message: 'L\'auteur du message est obligatoire.'});
        }

        //On va vérifier que le channel existe bien !
        if(body.channel_id) {

            try {
                const user = res.locals.token.user
                await showChannel(body.channel_id, user);
            } catch(err) {
                if(err.code === 404) {
                    return res.status(404).json({message: 'resource_not_found'})
                }

                if(err.code === 403) {
                    return res.status(403).json({message: 'forbidden'})
                }

                console.log("xerr", err)
                return res.status(500).json({message: err});
            }
        } else {
            return res.status(400).json({message: 'Un message doit etre associé à un channel.'});
        }
    } else {
        return res.status(400).json({message: 'bad_request'});
    }

    return createNewMessage(body)
        .then(message =>  res.status(201).json(message))
        .catch(({err}) => res.status(500).json({message: err}));
};

exports.update = (req, res) => {
    const messageId = req.params.messageId;
    const body = req.body;

    //Blindage du body
    if(body) {
        if(! body.content) {
            return res.status(400).json({message: 'Le contenu du message est obligatoire.'});
        }
    } else {
        return res.status(400).json({message: 'bad_request'});
    }

    //Si pas d'erreur au niveau de la requete, on peut procéder à la modification
    return updateMessage(messageId, body)
        .then(message => res.status(200).json(message))
        .catch(({code, err}) => {
            if(code === 404) {
                return res.status(404).json({message: 'resource_not_found'})
            }

            return res.status(500).json({message: err});
        });
};

exports.delete = (req, res) => {
    const messageId = req.params.messageId;

    return deleteMessage(messageId)
        .then(() => res.status(204).json())
        .catch(({code, err}) => {
            if(code === 404) {
                return res.status(404).json({message: 'resource_not_found'})
            }

            return res.status(500).json({message: err});
        });
};

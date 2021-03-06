const {
    listAllChannels,
    createNewChannel,
    showChannel,
    updateChannel,
    deleteChannel,
} = require('../models/channel_model');


exports.index = async (req, res) => {
    const channels = await listAllChannels();

    return res.status(200).json(channels);
};

exports.create = (req, res) => {
    const body = req.body;

    //Blindage du body
    if(body) {
        if(! body.name) {
            return res.status(400).json({message: 'Le nom est obligatoire.'});
        }
    } else {
        return res.status(400).json({message: 'bad_request'});
    }

    //Si pas d'erreur au niveau de la requete, on peut procéder à la création
    return createNewChannel(body)
        .then(channel =>  res.status(201).json(channel))
        .catch(({err}) => res.status(500).json({message: err}));
};

exports.show = (req, res) => {
    
  const channelId = req.params.channelId;
  const user = res.locals.token.user
  
  return showChannel(channelId, user)
      .then(channel => res.status(200).json(channel))
      .catch(({code, err}) => {
          if(code === 404) {
              return res.status(404).json({message: 'resource_not_found'})
          }
          else if(code === 403){
              return res.status(403).json({message: "doesn't have access to this channel !"})                
          }
          return res.status(500).json({message: err});
      });
};

exports.update = (req, res) => {
    const channelId = req.params.channelId;
    const body = req.body;

    //Blindage du body
    if(body) {
        if(! body.name && ! body.member) {
            return res.status(400).json({message: 'Le nom du channel oudu membrest obligatoire.'});
        }
    } else {
        return res.status(400).json({message: 'bad_request'});
    }

    //Si pas d'erreur au niveau de la requete, on peut procéder à la modification
    return updateChannel(channelId, body)
        .then(channel => res.status(200).json(channel))
        .catch(({code, err}) => {
            if(code === 404) {
                return res.status(404).json({message: 'resource_not_found'})
            }

            return res.status(500).json({message: err});
        });
};

exports.delete = (req, res) => {
    const channelId = req.params.channelId;

    return deleteChannel(channelId)
        .then(channel => res.status(204).json(channel))
        .catch(({code, err}) => {
            if(code === 404) {
                return res.status(404).json({message: 'resource_not_found'})
            }

            return res.status(500).json({message: err});
        });
};

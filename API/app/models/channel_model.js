const {v4: uuid} = require('uuid');
const db = require('../../db_config');

const listAllChannels = async () => {
    return new Promise((resolve, reject) => {
        const channels = [];

        const options = {
            gt: 'channels',
            lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1) + ":messages",
        };

        db.createReadStream(options)
            .on('data', ({key, value}) => {
                //On retire nos messages
                if(!key.match(/messages/)){
                    channels.push(JSON.parse(value));
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve(channels);
            });
    });
};

const createNewChannel = body => {
    return new Promise((resolve, reject) => {
        //on créé un objet channel
        const channel = {
            id: uuid(),
            name: body.name,
            owner: body.owner,
            members: body.members
        };

        // on insère en base de données (ID ==> Channel content)
        db.put(`channels:${channel.id}`, JSON.stringify(channel), (err) => {
            if(err) {
                reject({code: 500, err});

                return;
            }
            resolve(channel);
        })
    });
};

const showChannel = (channelId, user) => {
    return new Promise((resolve, reject) => {
        db.get(`channels:${channelId}`, (err, value) => {
            if(err) {
                if(err.notFound) {
                    reject({code: 404})
                } else {
                    reject({code: 500, err});
                }

                return;
            }

            let channel = JSON.parse(value);

            if((user && user.id === channel.owner) || (user && channel.members.includes(user.id))){
                resolve(channel);
            } else {
                reject({code: 403, err});
            }
        });

    });
};

const updateChannel = (channelId, body) => {
    return new Promise((resolve, reject) => {
        db.get(`channels:${channelId}`, (err, value) => {
            if(err) {
                if(err.notFound) {
                    reject({code: 404})
                } else {
                    reject({code: 500, err});
                }

                return;
            }

            let channel = JSON.parse(value);

            if(!body.name){
                channel.members.push(body.member)
            }
            else{
                channel.name = body.name; //seul le nom est modifiable
                channel.members.push(body.member)
            }

            //On réécrase dans la db
            db.put(`channels:${channel.id}`, JSON.stringify(channel), (err) => {
                if(err) {
                    reject({code: 500, err});

                    return;
                }

                resolve("Member added!");
            });
        });
    });
};

const deleteChannel = channelId => {
    //On doit supprimer tous les messages associés à ce channel
    //J'ai pas trouvé mieux pour le moment que (limitation de leveldb nodejs ?) :
    //Parcourir toutes les clés de type channels:channelId:messages:messageId
    //Utiliser un db.batch pour supprimer ensuite toutes les clés :
    //Il faut aussi penser à supprimer les clés messages:messageId

    //Cette partie est une partie complèxe, si ce n'est pas présent dans vos TP's, ce n'est pas très grave...

    //Ce qu'il faut comprendre ici surtout, c'est qu'en noSQL, ce n'est pas grave de dupliquer des données pour le besoin qu'on a
    //En revanche, il faut nécessairement synchroniser les données !

    const getChannelPromise = () => new Promise((resolve, reject) => {
        db.get(`channels:${channelId}`, (err, value) => {
            if(err) {
                if(err.notFound) {
                    reject({code: 404})
                } else {
                    reject({code: 500, err});
                }

                return;
            }

            resolve();
        });
    });

    const getMessageKeysPromise = () => new Promise((resolve, reject) => {
        const channelMessagesIds = [];
        const messageIds = [];

        const options = {
            gt: `channels:${channelId}:messages:`,
            lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        };

        db.createReadStream(options)
            .on('data', ({key, value}) => {
                channelMessagesIds.push(key);
                //On récupere le message id.
                //Les clés sont de la forme channels:channelId:messages:messageId
                //Ainsi, avec un split sur le caractère ':', on peut récuperer un tableau "splited" : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/split
                //Le message id se trouve à la derniere place du tableau (on sait que c'est l'élement 3)

                messageIds.push(`messages:${key.split(':')[3]}`);
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve({channelMessagesIds, messageIds});
            });
    });

    const deleteKeysPromise =  (keys) => new Promise((resolve, reject) => {
        const options = keys.map(key => ({
            type: 'del',
            key,
        }));

        //https://github.com/Level/levelup#dbbatcharray-options-callback-array-form
        db.batch(options, (err) => {
            if(err) {
                // handle I/O or other error
                reject({code: 500, err});

                return;
            }

            resolve();
        });
    });

    const deleteChannelPromise =  () => new Promise((resolve, reject) => {
        db.del(`channels:${channelId}`, (err) => {
            if(err) {
                // handle I/O or other error
                reject({code: 500, err});

                return;
            }
            console.log('dd');
            resolve();
        });
    });

    //Ici, j'utilise le principe des promesses pour "chainer" les actions, on peut faire mieux coté code ;)

    return getChannelPromise()
        //Etape 2
        //On récupere les clés à supprimer concernant les messages de ce channel
        .then(() => getMessageKeysPromise())
        //Etape 3
        //On supprime les messages qui concernent ce channel
        .then(({channelMessagesIds, messageIds}) => {
            return deleteKeysPromise(messageIds).then(() => deleteKeysPromise(channelMessagesIds));
        })
        //Etape 4
        //On supprime le channel
            .then(() => deleteChannelPromise());

    //Poser l'algo !
};

module.exports = {
    listAllChannels,
    createNewChannel,
    showChannel,
    updateChannel,
    deleteChannel,
};

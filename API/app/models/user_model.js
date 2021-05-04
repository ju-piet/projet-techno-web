const { v4: uuid } = require('uuid');
const db = require('../../db_config');
const jwt = require('jsonwebtoken');

const listAllUsers = async () => {
    return new Promise((resolve, reject) => {
        const users = [];

        const options = {
            gt: 'users:',
            lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        };

        //https://github.com/Level/level#createReadStream
        db.createReadStream(options)
            .on('data', ({ key, value }) => {
                users.push(JSON.parse(value));
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve(users);
            });
    });
};

const loginUser = async (body) => {
    return new Promise((resolve, reject) => {
        db.get(`usersEmail:${body.email}`, (err, value) => {
            if (err) {
                //https://github.com/Level/level#get
                //Niveau code, on peut mieux faire ;)
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }
            }

            if(!value){
                reject({ code: 404, message: "L'email ou mot de passe incorrect(s)" });
                return;
            }
            else{
                const userId = JSON.parse(value);

                db.get(`users:${userId}`, (err, value) => {
                    if (err) {
                        reject({ code: 500, err });
                    }
    
                    const user = JSON.parse(value);
    
                    if (body.email == user.email && body.password == user.password) {
                        jwt.sign({ user }, 'privatekey', { expiresIn: '1h' }, (err, token) => {
                            resolve({
                                access_token: token,
                                user
                            });
                        });
                    }
                    else {
                        reject({ code: 404, message: "L'email ou mot de passe incorrect(s)" });
                    }
    
                    //Le reject de la promesse ne termine pas l'opération
                    return;
                });
            }
        });
    });
};

const createNewUser = body => {
    //on créé un objet user
    const user = {
        id: uuid(),
        name: body.name,
        email: body.email,
        password: body.password, //Pas de password crypté pour le moment, on verra ça plus tard ...
    };

    return new Promise((resolve, reject) => {
        //https://github.com/Level/level#put
        // on insère en base de données
        db.put(`usersEmail:${user.email}`, JSON.stringify(user.id), (err) => {
            if (err) {
                reject({ code: 500, err });

                //Le reject de la promesse ne termine pas l'opération
                return;
            }
        })

        db.put(`users:${user.id}`, JSON.stringify(user), (err) => {
            if (err) {
                reject({ code: 500, err });

                //Le reject de la promesse ne termine pas l'opération
                return;
            }

            resolve("user is registered!");
        })
    });
};

const showUser = userId => {
    //on a un code asynchrone, on va donc utiliser les promesses pour nous simplifier la vie...
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_promesses
    return new Promise((resolve, reject) => {
        db.get(`users:${userId}`, (err, value) => {
            if (err) {
                //https://github.com/Level/level#get
                //Niveau code, on peut mieux faire ;)
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }

                //Le reject de la promesse ne termine pas l'opération
                return;
            }

            resolve(JSON.parse(value));
        });
    });
};

const updateUser = (userId, body) => {
    return new Promise((resolve, reject) => {
        db.get(`users:${userId}`, (err, value) => {
            if (err) {
                //https://github.com/Level/level#get
                //Niveau code, on peut mieux faire ;)
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }

                //Le reject de la promesse ne termine pas l'opération
                return;
            }

            //L'email n'est pas modifiable (il pourrait, mais faut gérer derriere ...)

            let user = JSON.parse(value);
            user.name = body.name;
            user.password = body.password; //Pour le projet, vous ferez mieux que juste ça ...

            //On réécrase dans la db
            db.put(`users:${user.id}`, JSON.stringify(user), (err) => {
                if (err) {
                    reject({ code: 500, err });

                    return;
                }

                resolve(user);
            });
        });
    });
};

const deleteUser = async userId => {
    return new Promise((resolve, reject) => {
        db.get(`users:${userId}`, (err, value) => {
            if (err) {
                //https://github.com/Level/level#get
                //Niveau code, on peut mieux faire ;)
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }

                //Le reject de la promesse ne termine pas l'opération
                return;
            }

            const user = JSON.parse(value);

            //On supprime de la db
            db.del(`users:${user.id}`, (err) => {
                if (err) {
                    // handle I/O or other error
                    reject({ code: 500, err });

                    return;
                }

                resolve(user);
            });
        });
    });
};

module.exports = {
    listAllUsers,
    createNewUser,
    loginUser,
    showUser,
    updateUser,
    deleteUser,
};
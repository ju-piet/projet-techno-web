const { v4: uuid } = require('uuid');
const db = require('../../db_config');
const jwt = require('jsonwebtoken');
const JWT_PRIVATE_KEY = require("../services/parameters").JWT_PRIVATE_KEY

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
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }
            }

            // Si on récupère pas d'utilisateur, on transmet une erreur et un message...
            if(!value){
                reject({ code: 404, message: "L'email ou mot de passe incorrect(s)" });
                return;
            }
            //...sinon...
            else{
                //... on récupère l'ID du user...
                const userId = JSON.parse(value);

                //... on récupère le user avec l'ID...
                db.get(`users:${userId}`, (err, value) => {
                    if (err) {
                        reject({ code: 500, err });
                    }
    
                    const user = JSON.parse(value);
    
                    //... si les identifiants de connexion sont bons...
                    if (body.email == user.email && body.password == user.password) {
                        //... on crée un token
                        jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '1h' }, (err, token) => {
                            resolve({
                                access_token: token,
                                user
                            });
                        });
                    }
                    else {
                        reject({ code: 404, message: "L'email ou mot de passe incorrect(s)" });
                    }
                    
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
        password: body.password, 
        isDay:body.isDay,
        lang:body.lang
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
    return new Promise((resolve, reject) => {
        db.get(`users:${userId}`, (err, value) => {
            if (err) {
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }

                return;
            }
            resolve(JSON.parse(value));
        });
    });
};

const showUserByEmail = userEmail => {
    return new Promise((resolve, reject) => {
        db.get(`usersEmail:${userEmail}`, (err, value) => {
            if (err) {
                if (err.notFound) {
                    reject({ code: 404 })
                } else {
                    reject({ code: 500, err });
                }

                return;
            }

            db.get(`users:${JSON.parse(value)}`, (err, value) => {
                if (err) {
                    if (err.notFound) {
                        reject({ code: 404 })
                    } else {
                        reject({ code: 500, err });
                    }
    
                    return;
                }
    
                resolve(JSON.parse(value));
            });
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

            // On récupère notre user
            let user = JSON.parse(value);

            /* Modification du user */
            user.name = body.name;
            user.password = body.password; 
            user.isDay = body.isDay;
            user.lang = body.lang; 

            //On réécrase dans la db
            db.put(`users:${user.id}`, JSON.stringify(user), (err) => {
                if (err) {
                    reject({ code: 500, err });

                    return;
                }

                resolve({ message: 'The user has been changed!'});
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
    showUserByEmail,
};
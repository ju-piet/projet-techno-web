const {
    listAllUsers,
    loginUser,
    createNewUser,
    showUser,
    showUserByEmail,
    updateUser,
    deleteUser,
} = require('../models/user_model');


exports.index = async (req, res) => {
    const users = await listAllUsers();

    return res.status(200).json(users);
};

exports.login = (req, res) => {
    const body = req.body;

    //Blindage 
    if (body) {
        if (!body.email) {
            return res.status(400).json({ message: 'L\'email n\'est pas valide.' });
        }
        if (!body.password) {
            return res.status(400).json({ message: 'Le mot de passe n\'est pas valide.' });
        }
    } else {
        return res.status(400).json({ message: 'bad_request' });
    }

    return loginUser(body)
        .then(response => {
            res.status(200).json(response)
        })
        .catch(({ code, message, err }) => {
            if (code === 404) {
                return res.status(404).json({ message })
            }

            return res.status(500).json({ message: err });
        });
}

exports.create = (req, res) => {
    const body = req.body;

    //Blindage du body
    //Seul le nom est modifiable

    //On pourrait faire un blindage sur le nom unique si c'est une spec qu'on veut (complex car faut revoir nos clés lors de la création...)

    if (body) {
        if (!body.name) {
            return res.status(400).json({ message: 'Le nom est obligatoire.' });
        }

        if (!body.email) {
            return res.status(400).json({ message: 'L\'email est obligatoire.' });
        }

        if (!body.password) {
            return res.status(400).json({ message: 'Le mot de passe est obligatoire.' });
        }
        if (!body.isDay) {
            return res.status(400).json({ message: 'Le thème n\'est pas renseigné.' });
        }
        if (!body.lang) {
            return res.status(400).json({ message: 'Le langue n\'est pas renseignée.' });
        }
    } else {
        return res.status(400).json({ message: 'bad_request' });
    }

    return createNewUser(body)
        .then(user => res.status(201).json(user))
        .catch(({ err }) => res.status(500).json({ message: err }));
};

exports.show = (req, res) => {
    const userId = req.params.userId;

    return showUser(userId)
        .then(user => res.status(200).json(user))
        .catch(({ code, err }) => {
            if (code === 404) {
                return res.status(404).json({ message: 'resource_not_found' })
            }

            return res.status(500).json({ message: err });
        });
};

exports.showByEmail = (req, res) => {
    const userEmail = req.params.userEmail;

    return showUserByEmail(userEmail)
        .then(user => res.status(200).json(user))
        .catch(({ code, err }) => {
            if (code === 404) {
                return res.status(404).json({ message: 'resource_not_found' })
            }

            return res.status(500).json({ message: err });
        });
};

exports.update = (req, res) => {
    const userId = req.params.userId;
    const body = req.body;

    //Blindage du body
    //Seul le nom est modifiable

    //On pourrait faire un blindage sur le nom unique si c'est une spec qu'on veut (complex car faut revoir nos clés lors de la création...)

    if (body) {
        if (!body.name) {
            return res.status(400).json({ message: 'Le nom est obligatoire.' });
        }
        if (!body.password) {
            return res.status(400).json({ message: 'Le mot de passe est obligatoire.' });
        }
        if (!body.lang) {
            return res.status(400).json({ message: 'Le langue n\'est pas renseignée.' });
        }
    } else {
        return res.status(400).json({ message: 'bad_request' });
    }

    //Si pas d'erreur au niveau de la requete, on peut procéder à la modification

    return updateUser(userId, body)
        .then(message => res.status(200).json(message))
        .catch(({ code, err }) => {
            if (code === 404) {
                return res.status(404).json({ message: 'resource_not_found' })
            }

            return res.status(500).json({ message: err });
        });
};

exports.delete = (req, res) => {
    const userId = req.params.userId;

    return deleteUser(userId)
        .then(() => res.status(204).json())
        .catch(({ code, err }) => {
            if (code === 404) {
                return res.status(404).json({ message: 'resource_not_found' })
            }

            return res.status(500).json({ message: err });
        });
};
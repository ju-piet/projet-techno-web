# Application chat

## Introduction
Le but de ce projet a été la création d'un chat, en utilisant toutes les notions vu en cours.

Ce chat doit comporter plusieurs fonctionnalités comme :
* S’authentifier avec un compte local, de pouvoir s'enregistrer avec un formulaire d’inscription et pouvoir se déconnecter de l'application
* Fournir un écran de bienvenue après la connexion
* Créer un channel et pouvoir y ajouter des membres
* Protéger l'accès des routes à l'aide d'un token
* Autoriser ou non l'accès à un channel pour un membre
* Inviter un membre à un channel existant
* Modifier et supprimer un message
* Ajouter des paramètres de compte

## La connexion, l'inscription et le déconnexion
### La connexion
La connexion se fait à l'aide de la page suivante :
#### image

Lorsque l'utilisateur se connecte, ses identifiants sont vérifiés dans la base et si l'utilisateur est trouvé, un token lui est attribué.

#### Front-end 
Au niveau du front, nous avons utilisé un router afin de créer nos routes :
```
<Router>
    <Switch>
        <Route exact path="/">
            <Login setUser={setUser} setToken={setToken} setContinued={setContinued} />
        </Route>

        <Route path="/register">
                <Register />
        </Route>
    </Switch>
 </Router>
```
Ainsi la connexion se fait avec la route qui a pour chemin : "/"

Voici notre code :
```
function Login({setUser, setToken, setContinued}){
    /* On initialise nos states user */
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();

    // On initialise notre erreur de login
    const [loginError, setLoginError] = useState(false);

    // Lorsqu'on clique sur le bouton login...
    const onSubmitLogin = () => {
        // On poste notre login dans la base afin de vérifier si l'utilisateur existe...
        axios.post('http://localhost:8000/api/v1/users/login', {
            email: userEmail,
            password: userPassword
        })
        //... s'il existe...
        .then(response => {
            //... on set notre token
            setToken(response.data.access_token)
            //... on set notre user
            setUser(
                response.data.user,
            );
            //... on set notre bool pour la page welcome
            setContinued(false)
            //... on set l'erreur de login à true
            setLoginError(false);
        })
        //... s'il n'existe pas...
        .catch(err => {
            if (err.status === 404) {
                //... on set l'erreur de login à true
                setLoginError(true);
            }
        })
    }
```

Lorsque l'utilisateur est connecté, on entre ses valeurs dans un context.

Notre *Context.js* :
```
import React, { useState } from 'react';

/* La création des contexts */
export const UserContext = React.createContext();
export const TokenContext = React.createContext();


// Le context du message
export const MessageContext = React.createContext();

export const MessageContextProvider = props => {

  const setMessageContent = (messageContent) => {
    _setState({ ...state, messageContent: messageContent })
  }

  const initState = {
    messageContent: "",
    setMessageContent: setMessageContent,

    setMessageId: id => _setState({ ...state, messageId: id }),
    messageId: null,

    setState: state => _setState(state),
  }

  const [state, _setState] = useState(initState)

  return (
    <MessageContext.Provider value={state}>
      {props.children}
    </MessageContext.Provider>
  )
}
```

On appelle nos *Providers* :
```
return (
    <div className="app" style={styles.root}>
        {/* On utilise le context pour donner accès à certaines données */}
            <MessageContextProvider>
                <UserContext.Provider value={user}>
                    <TokenContext.Provider value={token}>
                        <Header setUser={setUser} setContinued={setContinued}/>
                        <Main />
                           <Footer />
                    </TokenContext.Provider>
                </UserContext.Provider>
            </MessageContextProvider>
        </div>
    );
```

#### Back-end 
Au niveau du back, nous avons le code suivant :
```
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
```

### L'inscription
L'inscription se fait à l'aide de la page suivante :
#### image

#### Front-end 
Au niveau du front, nous avons utilisé un router afin de créer nos routes :
```
<Router>
    <Switch>
        <Route exact path="/">
            <Login setUser={setUser} setToken={setToken} setContinued={setContinued} />
        </Route>

        <Route path="/register">
                <Register />
        </Route>
    </Switch>
 </Router>
```
Ainsi l'inscription se fait avec la route qui a pour chemin : "/register"

Voici notre code :
```
function Register() {
    /* On initialise nos states user */
    const [newUserName, setnewUserName] = useState('');
    const [newUserEmail, setnewUserEmail] = useState('');
    const [newUserPassword, setnewUserPassword] = useState('');
   
    // On initialise notre erreur de register
    const [registerError, setRegisterError] = useState(false);

    // On initialise notre state message
    const [message, setMessage] = useState('');

    const onSubmitRegister = () => {
        // On poste notre user en base 
        axios.post('http://localhost:8000/api/v1/users', {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            isDay:true,
            lang:'EN'
        })
        .then(response => {
            /* On set nos states */
            setMessage(response.data)
            setnewUserName('')
            setnewUserEmail('')
            setnewUserPassword('')
            setRegisterError(false)
        })
        .catch(err => {
            if (err.status === 404) {
                //... on set l'erreur de register à true
                setRegisterError(true)
                //... on set notre message
                setMessage('')
            }
        })
    }
```

### La déconnexion
La déconnexion se fait à l'aide du bouton logout/déconnexion :
#### image

#### Front-end 
Au niveau du front, voici notre code :
```
// Lorsqu'on clique sur notre bouton logout...
const logout = () => {
	//... on réinitialise notre user 
	setUser(null)
	//... on réinitialise notre bool d'accès à la page welcome 
	setContinued(false)
	//... on supprime notre token dans le local storage
	window.localStorage.removeItem('token');
}
```

##### Les explications se situent au niveau des commentaires.

## L'écran de bienvenue
Voici notre page bienvenue :
#### image

Lorsqu'on clique sur le bouton continuez, on accède à l'application.

#### Front-end 
Au niveau du front, voici notre code :
```
// Lorsqu'on se login, on arrive sur la page welcome
const Welcome = ({ setContinued, user }) => {

    // Lorsqu'on clique sur le bouton continuez...
    const autoriseContinued = () => {
        //... on renvoie le state continued en true 
        setContinued(true);
    }
```

Dans le parent, le code est le suivant :
```
const [isContinued, setContinued] = useState(false);

// Une fois login, on arrive sur la page de bienvenue
if(isContinued === false){
    return (
        <Welcome setContinued={setContinued} user={user}/>
    );
}
```

##### Les explications se situent au niveau des commentaires.

## La création du channel
La création du channel se fait à l'aide du bouton entouré :
#### image

Cela lance, une popup que voici :
#### image

#### Front-end 
Au niveau du front, voici notre code :
```
// Lorsqu'on clique sur le bouton ajouter un channel, on lance une popup...
	const launchPopup = () => {
		//... si on a pas rentré un nom de channel
		if(!channelName){
			if(user.lang === 'EN'){
				//... on set un message (en anglais)
				setMessageChannel('You must give a name to the channel')
			}
			else{
				//... on set un message (en français)
				setMessageChannel('Vous devez donner un nom à la chaine')
			}
		}
		//... si on a pas rentré un nom de channel
		else{
			setActivatePopup(true);
		}
	};

	// Lorsqu'on clique sur le bouton valider
	const publishChannel = () => {
		// On poste le channel en base
		axios.post('http://localhost:8000/api/v1/channels', {
			name: channelName,
			owner: user.id,
			members: channelMembers,
		})
		.then(response => {

			/* On set les informations du channel */
			setChannelName('');
			setChannelMember('');
			setChannelMembers([]);

			/* On set les messages d'information */
			setMessageMember('');
			setMessageChannel('');

			/* On set les messages d'information */
			setActivate(false);
			setActivatePopup(false);
	
			// On récupère les channels
			axios.get('http://localhost:8000/api/v1/channels', {
			}).then(response => {
				setChannels(response.data);
			})
		})
	}

	// Lorsqu'on clique sur le bouton annuler
	const cancelpublish = () => {
		// On ferme la popup
		setActivatePopup(false);
	}

	const createChannel = () => {
		if (isActivatedCreate === false) {
			setActivate(true);
		}
		else {
			setActivatePopup(false);
			setActivate(false);
		}
	};

	const addMember = () => {
		//On récupère le userId avec son email dans la base...		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember, {
		}).then(response => {
			// si le member n'est pas déja membre...
			if(!channelMembers.includes(response.data.id)){
				//... on set la liste des membres avec l'ID du user récupéré
				setChannelMembers([
					...channelMembers,
					response.data.id
				])
				//... on set le nom du membre avec le user récupéré
				setChannelMemberName([
					...channelMemberName,
					response.data.name
				])

				if(user.lang === 'EN'){
					//... on set le message d'information du membre (anglais)
					setMessageMember('member added!')
				}
				else{
					//... on set le message d'information du membre (français)
					setMessageMember('membre ajouté !')
				}
			}
			// sinon si le member est pas déja membre du channel...
			else{		
				if(user.lang === 'EN'){
					//... on set le message d'information du membre (anglais)
					setMessageMember('member already added!')
				}
				else{
					//... on set le message d'information du membre (français)
					setMessageMember('membre déjà ajouté !')
				}
			}
		})
```

#### Back-end 
Au niveau du back, nous avons le code suivant :
* Pour créer notre channel :
```
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
```

* Pour récupérer nos channels :
```
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
```

* Pour récupérer notre user avec son email :
```
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
```

##### Les explications se situent au niveau des commentaires.

## L'acces des routes en fonction d'un token
Nous avons protégé nos routes à l'aide de token, pour cela nous avons créé un *token.js* dans notre dossier services :
```
const jwt = require('jsonwebtoken');
const JWT_PRIVATE_KEY = require("./parameters").JWT_PRIVATE_KEY


const extraireTok = headerValue => {
    if( typeof headerValue !== 'string'){
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

//verification  du token
const verifTok = (req, res, next) => {
    // Récupération du token
    const token = req.headers.authorization && extraireTok(req.headers.authorization)

    // Si on a pas de token...
    if(!token){
        //... On retourne une requête erreur
        return res.status(401).json({message: 'il manque le token'})
    }

    // Vérification du token 
    jwt.verify(token, JWT_PRIVATE_KEY, (err) => {
        if(err){
            return res.status(401).json({message: 'mauvais token'})
        } else {
            res.locals.token = jwt.decode(token, JWT_PRIVATE_KEY)
            
            return next()
        }
    })
};

module.exports = verifTok
```

Ce middleware est utilisé pour les routes (*exemple : les routes channel*) :
```
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
```

##### Les explications se situent au niveau des commentaires.

## L'acces des membres aux channels
L'accès aux channels se déduit au moment du clique sur un channel.

#### Front-end
Au niveau du front, voici notre code :
```
// Lorsqu'on sélectionne un channel...
const onSelectChannel = useCallback(
	//... on récupère le channel sélectionné en base
	channel => axios.get('http://localhost:8000/api/v1/channels/' + channel.id)
		.then(response => {
			//... on renvoie la réponse au parent du composant (Main)
			handleClick(response.data)
			//... on renvoie l'erreur au parent
			setError(false);
		})
		.catch(err =>{
			console.log(err)
			//... on renvoie l'erreur au parent
			setError(true);
		}),
	[handleClick,setError],
);
```

#### Back-end
Au niveau du back, voici notre code :
```
if((user && user.id === channel.owner) || (user && channel.members.includes(user.id))){
    resolve(channel);
    } else {
    reject({code: 403, err});
}
```

C'est à ce niveau qu'on vérifie si l'utilisateur a accès au channel.

##### Les explications se situent au niveau des commentaires.

## L'invitation des utilisateurs 
L'invitation se fait à l'aide du bouton entouré :
#### image

Cela ouvre la page suivante :
#### image

#### Front-end 
Au niveau du front, voici notre code :
```
// Page invitation d'un membre
function Invite() {
	// On initialise notre context user
	const user = useContext(UserContext);

	/* On initialise les states channel */
	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState([]);
	const [channelMember, setChannelMember] = useState('');
	const [channelMemberId, setChannelMemberId] = useState('');

	// On initialise le state message d'info
	const [message, setMessage] = useState('');

	useEffect(() => {
		// Lorsqu'on charge le compiosant, on récupère les channels en base
		axios.get('http://localhost:8000/api/v1/channels', {
		}).then(response => {
			setChannels(response.data);
		})
	}, []);

	const addMember = () => {
		//On va chercher le userId avec son email...		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember).then(response => {
			setChannelMemberId(response.data.id);

			//... on update les membre du channel avec le userId récupéré...
			axios.put('http://localhost:8000/api/v1/channels/' + selectedChannel.id, {
				name: selectedChannel.name,
				member: channelMemberId
			}).then(response => {
				//... lorsqu'il est ajouté on set le message d'ajout et le membre (car il est ajouté)
				setMessage(response.data)
				setChannelMember('')
			})
			.catch(err => {
				console.log(err)
			})
		})
		.catch(err => {
			console.log(err)
		})
	};
```

#### Back-end 
Au niveau du back, voici notre code :
```
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
```

##### Les explications se situent au niveau des commentaires.

## La modification et la suppression d'un message
La modification et la suppression d'un message à l'aide des boutons suivants :
#### image

### La modification 
#### Front-end
Au niveau du front, voici notre code :
```
// Lorsqu'on clique sur le bouton update du message...
const updateMessage = () => {
	//... on set le state avec le context
    messageContext.setState({
		...messageContext,
		messageContent: message.content,
		messageId: message.id,
	})		
}
```

#### Back-end
Ici, le back est appelé dans un autre composant (message) :
```
const MessageForm = ({ onAddMessage, channel }) => {
	/* On initilise nos contexts */
	const user = useContext(UserContext);
	const messageContext = useContext(MessageContext);
	const { setMessageContent, messageContent, messageId } = messageContext

	const sendMessage = () => {
		// on set une constante avec notre message ID
		const isUpdating = messageId

		// on set notre message
		const message = {
			id: isUpdating ? messageId : undefined,	//condition ternaire 
			author: user.name,
			content: messageContent,
			channel_id: channel.id,
		}

		// si l'ID du message a été set...
		if (isUpdating) {
			//... on modifie le message en base...
			axios.put('http://localhost:8000/api/v1/messages/' + messageId, {
				content: message.content
			})
				//... s'il a bien été modifié...
				.then(() => {
					//... on renvoie le message au parent 
					onAddMessage(message);

					//...on set le state du context
					messageContext.setState({
						...messageContext,
						messageId: null,
						messageContent: "",
					})
				})
				.catch(err => {
					console.log(err)
				})
		}

		// si l'ID du message n'a pas été set (si on écrit un message)...
		else {
			// on ajoute le message en base...
			axios.post('http://localhost:8000/api/v1/messages', {
				...message,
			})
				//... si le message a bien été ajouté
				.then(() => {
					//... on renvoie le message au parent 	
					onAddMessage(message);
					//... on réinitialise notre message content 
					setMessageContent('');
				})
				.catch(err => {
					console.log(err)
				})
		}
	};
```

Au niveau du back, voici notre code :
```
const updateMessage = (messageId, body) => {
    return new Promise((resolve, reject) => {
        db.get(`messages:${messageId}`, (err, value) => {
            if(err) {
                //https://github.com/Level/level#get
                //Niveau code, on peut mieux faire ;)
                if(err.notFound) {
                    reject({code: 404})
                } else {
                    reject({code: 500, err});
                }

                //Le reject de la promesse ne termine pas l'opération
                return;
            }

            const mappingMessage = JSON.parse(value);

            db.get(`channels:${mappingMessage.channelId}:messages:${messageId}`, (err, value) => {
                if(err) {
                    //https://github.com/Level/level#get
                    //Niveau code, on peut mieux faire ;)
                    if(err.notFound) {
                        reject({code: 404})
                    } else {
                        reject({code: 500, err});
                    }

                    //Le reject de la promesse ne termine pas l'opération
                    return;
                }

                let message = JSON.parse(value);
                message.content = body.content;

                db.put(`channels:${mappingMessage.channelId}:messages:${messageId}`, JSON.stringify(message), (err) => {
                    if(err) {
                        reject({code: 500, err});

                        //Le reject de la promesse ne termine pas l'opération
                        return;
                    }

                    resolve(message);
                })
            });
        });
    });
};
```

### La suppression
#### Front-end
Au niveau du front, voici notre code :
```
// Lorqu'un message est supprimé...
const deleteMessage = (messageId) => {
	// ... on récupère les messages qui ne contiennent pas l'ID du message supprimé
	const currentMessages = messages.filter(message => message.id !== messageId)

	//... on set les messages récupérés
	setMessages(currentMessages);
}
```

#### Back-end
Ici, le back est appelé dans un autre composant (message) :
```
// Lorsqu'on clique sur le bouton supprimer du message...
const onSubmitDelete = () => {
	//... on le supprime en base...
    axios.delete('http://localhost:8000/api/v1/messages/' + message.id);
	//... et on renvoie l'id du message au parent 
	deleteMessage(message.id);
}
```

Au niveau du back, voici notre code :
```
const deleteMessage = async messageId => {
    return new Promise((resolve, reject) => {
        db.get(`messages:${messageId}`, (err, value) => {
            if(err) {
                if(err.notFound) {
                    reject({code: 404})
                } else {
                    reject({code: 500, err});
                }

                return;
            }

            const mappingMessage = JSON.parse(value);

            //On supprime de la db
            db.del(`channels:${mappingMessage.channelId}:messages:${mappingMessage.id}`, (err) => {
                if(err) {
                    // handle I/O or other error
                    reject({code: 500, err});

                    return;
                }

                db.del(`messages:${mappingMessage.id}`, (err) => {
                    if(err) {
                        // handle I/O or other error
                        reject({code: 500, err});

                        return;
                    }
                });

                resolve();
            });
        });
    });
};
```

##### Les explications se situent au niveau des commentaires.

## Les paramètres du compte
Le changement des paramètres s'activent à l'aide du bouton entouré :
#### image

Le changement des paramètres du compte se font sur cette page :
#### image

#### Front-end 
Au niveau du front, voici notre code :
```
// Page de changment d'informations user
function ChangeUserInfo({ setUser }) {
	// On initialise le context
	const user = useContext(UserContext);

	/* On initialise les states user */
	const [userName, setUserName] = useState('');
	const [userPassword, setUserPassword] = useState('');

	// On initialise le state message
	const [message, setMessage] = useState('');

	// Lorsqu'on clique sur le switch du theme...
	const handleChangeMode = () => {
		//... si le user avait le light mode...
		if (user.isDay === true) {
			//... on set le theme user est en dark
			setUser({
				...user,
				isDay: false
			})
		}
		else {
			//... on set le theme user est en light
			setUser({
				...user,
				isDay: true
			})
		}
	};

	// Lorsqu'on clique sur le switch de langue...
	const handleChangeLang = () => {
		//... si le user avait la langue en anglais...
		if (user.lang === 'EN') {
			//... on set la langue user est en français
			setUser({
				...user,
				lang: 'FR'
			})
		}
		//... si le user avait la langue en français...
		else {
			setUser({
				//... on set la langue user est en anglais
				...user,
				lang: 'EN'
			})
		}
	};

	// Lorsqu'on clique sur le bouton de sauvegarde de préférences...
	const savePref = () => {
		//... on update notre user en base...
		axios.put('http://localhost:8000/api/v1/users/' + user.id, {
			name: user.name,
			password: user.password,
			isDay: user.isDay,
			lang: user.lang,
		})
		//... si l'update n'est pas possible, on set un message d'erreur
		.catch((error) => setMessage(
			error.response.data.message
		));
	};

	// Lorsqu'on clique sur le bouton modifier...
	const changeUser = () => {
		//... on modifie le user en base
		axios.put('http://localhost:8000/api/v1/users/' + user.id, {
			name: userName,
			password: userPassword,
		})
		//... on set un message avec ce que nous renvoie le back
		.then(response => {
			setMessage(response.data.message);
		})
		//... si l'update n'est pas possible, on set un message d'erreur
		.catch((error) => setMessage(error.response.data.message));
	}
```

#### Back-end 
Au niveau du back, voici notre code :
```
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
```

##### Les explications se situent au niveau des commentaires.

## Auteurs : Julien PIET et Mohammed NAMANE


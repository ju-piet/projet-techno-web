import React, {useState, useEffect, useContext} from 'react';
import Messages from '../message/Messages';
import MessageForm from '../message/MessageForm';
import axios from 'axios';
import { TokenContext, UserContext } from '../Contexts';

const styles = {
	channel: {
		height: '100%',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
	},
	messagesDay: {
		flex: '1 1 auto',
		height: '100%',
		overflow: 'auto',
		'& ul': {
			'margin': 0,
			'padding': 0,
			'textIndent': 0,
			'listStyleType': 0
		},
		color:'#000000',
	},
	messagesNight: {
		flex: '1 1 auto',
		height: '100%',
		overflow: 'auto',
		'& ul': {
			'margin': 0,
			'padding': 0,
			'textIndent': 0,
			'listStyleType': 0
		},
		color:'#ffffff',
	},
};

const texts = {
	"FR": {
		"error": "Vous n'avez pas accès à cette chaine",
		"channelError": "S'il vous plait, veuillez sélectionner une chaine",
		"message": "Les messages de : "
	},

	"EN": {
		"error": "You doesn't have access to this channel",
		"channelError": "Please, select a channel",
		"message": "Messages for : "
	},
}

const Channel = ({channel, error}) => {
	/* On initialise nos states */
	const [messages, setMessages] = useState([]);
	const token = useContext(TokenContext);
	const user = useContext(UserContext);

	// A chaque chargement du composant...
	useEffect(() => {
		if(channel){
			//... si le channel est sélectionné, on récupère les messages en base...
			axios.get('http://localhost:8000/api/v1/channels/'+ channel.id +'/messages', {
				//... avec notre token dans le header
				headers: {
					authorization: "Bearer " + token
				}
			})
			.then(response => {
				//... si l'utilisateur est le créateur ou s'il est membre du channel
				if(user.id===channel.owner || channel.members.includes(user.id)){
					//... on set les messages que la base nous renvoie
					setMessages(response.data);
				}
			})
		}
	}, [channel, user.id, token]);

	// // Lorqu'un message est ajouté...
	const onAddMessage = () => {
		//... on récupère les messages pour tous les afficher
		axios.get('http://localhost:8000/api/v1/channels/'+ channel.id +'/messages')
		.then(response => {
			//... on set les messages récupérés
			setMessages(response.data);
		})

	};

	// Lorqu'un message est supprimé...
	const deleteMessage = (messageId) => {
		// ... on récupère les messages qui ne contiennent pas l'ID du message supprimé
		const currentMessages = messages.filter(message => message.id !== messageId)

		//... on set les messages récupérés
		setMessages(currentMessages);
	}

	// Si on a pas accès au channel (error)...
	if(error){
		// ... on affiche un message d'erreur
		return(
			<div>
				<h1 style={{color:'black'}}>{texts[user.lang]["error"]}</h1>
			</div>
		)
	}

	// Si on a sélectionné aucun channel...
	if(!channel){
		// ... on affiche un message 
		return(
			<div>
				<h1 style={{color:'black'}}>{texts[user.lang]["channelError"]}</h1>
			</div>
		)
	}

	// Sinon on affiche le channel et ses messages
	return (
		<div style={styles.channel}>
			<div style={user.isDay ? styles.messagesDay : styles.messagesNight}>
					<h1>{texts[user.lang]["message"]} {channel.name}</h1>
				<Messages messages={messages} deleteMessage={deleteMessage} />
			</div>
			<MessageForm onAddMessage={onAddMessage} channel={channel} />
		</div>
	);
};

export default Channel;

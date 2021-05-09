import React, { useContext } from 'react';
import { MessageContext, UserContext } from '../Contexts'
import { Button } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';

const styles = {
	form: {
		borderTop: '2px solid black',
		padding: '.5rem',
		display: 'flex',
		width: '100%'
	},
	textarea: {
		width: '100%'
	},
	send: {
		backgroundColor: '#6495ED',
		color: '#000000',
		padding: '.2rem .5rem',
		border: 'none',
		width: '100px',
		marginRight: 20,
		marginLeft: 10,
		':hover': {
			backgroundColor: '#2A4B99',
			cursor: 'pointer',
			color: '#fff'
		},
	},
};

// MessageForm
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

	// Lorsqu'on écrit dans le form...
	const onChange = (e) => {
		//... on set le state de notre context avec ce qu'on écrit
		messageContext.setState({ ...messageContext, messageContent: e.target.value });
	};

	// On affiche notre message form 
	return (
		<div style={styles.form}>
			<textarea
				style={styles.textarea}
				onChange={onChange}
				name="content"
				rows={5}
				value={messageContent}
			/>

			<Button variant="contained" color="primary" style={styles.send} onClick={sendMessage}>
				<SendIcon fontSize="large" />
			</Button>
		</div>
	)
};

export default MessageForm;

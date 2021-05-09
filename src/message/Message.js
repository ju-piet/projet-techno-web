import React, { useContext } from 'react';
import moment from 'moment';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import axios from 'axios';
import { MessageContext, UserContext } from '../Contexts';

const nl2br = require('react-nl2br');

const styles = {
	message: {
		margin: '.2rem',
		padding: '.2rem',
		':hover': {
			backgroundColor: 'rgba(255,255,255,.2)'
		}
	},
	buttonUpdate : {
		color:'#000000',
		backgroundColor: '#6495ED',
		marginRight:5,
	},
	buttonDelete : {
		color:'#000000',
		backgroundColor: '#DC143C',
		marginRight:5,
	},
	buttons : {
		display: 'flex',
		margin:5,
	}
};

// Message
const Message = ({message, deleteMessage}) => {
	/* On initilise nos contexts */
	const user = useContext(UserContext);
	const messageContext = useContext(MessageContext);

	// Lorsqu'on clique sur le bouton supprimer du message...
	const onSubmitDelete = () => {
		//... on le supprime en base...
        axios.delete('http://localhost:8000/api/v1/messages/' + message.id);
		//... et on renvoie l'id du message au parent 
		deleteMessage(message.id);
    }

	// Lorsqu'on clique sur le bouton update du message...
	const updateMessage = () => {
		//... on set le state avec le context
        messageContext.setState({
			...messageContext,
			messageContent: message.content,
			messageId: message.id,
		})		
    }
	
	// On affiche notre message
	return(	<li style={styles.message}>
		<p>
			<span>{message.author}</span>
			{' '}
			<span>{moment(message.creation).fromNow()}</span>
		</p>
		<div style={styles.buttons}>
			{nl2br(message.content)}

			{message.author === user.name &&(
				<div>
					<Button onClick={updateMessage} variant="contained" style={styles.buttonUpdate}>
						<CreateIcon />
					</Button>
					<Button variant="contained" style={styles.buttonDelete} onClick={onSubmitDelete}>
						<DeleteIcon />
					</Button>
				</div>
			)}

		</div>
	</li>
	)
}

export default Message;

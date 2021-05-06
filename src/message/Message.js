import React, {useState, useContext} from 'react';
import moment from 'moment';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import axios from 'axios';
import { MessageContext, UserContext } from '../Contexts';

//Permet d'inserer un retour à la ligne
//https://github.com/yosuke-furukawa/react-nl2br#readme
const nl2br = require('react-nl2br');

const styles = {
	message: {
		margin: '.2rem',
		padding: '.2rem',
		// backgroundColor: '#66728E',
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

const Message = ({message, deleteMessage}) => {


	const user = useContext(UserContext);
	const messageContext = useContext(MessageContext);

	const onSubmit = e => {
        axios.delete('http://localhost:8000/api/v1/messages/' + message.id);
		deleteMessage(message.id);
    }

	const updateMessage = () => {

        messageContext.setState({
			...messageContext,
			messageContent: message.content,
			messageId: message.id,
		})

		console.log("before conte", message.id)
		
    }
	

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
					<Button variant="contained" style={styles.buttonDelete} onClick={onSubmit}>
						<DeleteIcon />
					</Button>
				</div>
			)}

		</div>
	</li>
	)
}


export default Message;

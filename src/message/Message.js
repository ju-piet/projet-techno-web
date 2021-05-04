import React from 'react';
import moment from 'moment';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import axios from 'axios';

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
};

const Message = ({message, deleteMessage}) => {
	const onSubmit = e => {
        axios.delete('http://localhost:8000/api/v1/messages/' + message.id);
		deleteMessage(message.id);
    }
	

	return(	<li style={styles.message}>
		<p>
			<span>{message.author}</span>
			{' '}
			<span>{moment(message.creation).fromNow()}</span>
		</p>
		<div>
			{nl2br(message.content)}
			<Button variant="contained">
              <CreateIcon />
            </Button>
			<Button variant="contained" onClick={onSubmit}>
              <DeleteIcon />
            </Button>
		</div>
	</li>
	)
}


export default Message;

import React, {useState, useContext, useEffect} from 'react';
import {MessageContext, TokenContext, UserContext} from '../Contexts'
import { Button } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';

const styles = {
	form: {
		borderTop: '2px solid black',
		padding: '.5rem',
		display: 'flex',
		width:'100%'
	},
	textarea: {
		width:'100%'
	},
	send: {
		backgroundColor: '#6495ED',
		color:'#000000',
		padding: '.2rem .5rem',
		border: 'none',
		width:'100px',
		marginRight:20,
		marginLeft:10,
		':hover': {
			backgroundColor: '#2A4B99',
			cursor: 'pointer',
			color: '#fff'
		},
	},
};

const MessageForm = ({onAddMessage, channel}) => {
	const user = useContext(UserContext);
	const token = useContext(TokenContext);
	const messageContext = useContext(MessageContext);
	const {setMessageContent, messageContent, messageId} = messageContext


	//You can improve this function with one hook (useCallback) :
	// https://fr.reactjs.org/docs/hooks-intro.html
	// https://fr.reactjs.org/docs/hooks-reference.html
	const onSubmit = () => {

		const isUpdating = messageId

		const message = {
			id: isUpdating ? messageId : undefined,
			author: user.name,
			content: messageContent,
			channel_id: channel.id,
		}

		if(isUpdating){
			axios.put('http://localhost:8000/api/v1/messages/' + messageId, {
				content: message.content
			})
			.then(() => {
				
				onAddMessage(message);
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

		// is creating
		else {
			axios.post('http://localhost:8000/api/v1/messages', {
				...message,
			})
			.then(() => {
				
				onAddMessage(message);
				setMessageContent('');
			})
			.catch(err => {
				console.log(err)
			})
		}



	};

	//You can improve this function with one hook (useCallback) :
	const onChange = (e) => {

		messageContext.setState({...messageContext, messageContent: e.target.value});
	};

	return (
		<div style={styles.form}>
            <textarea 
				style={styles.textarea}
				onChange={onChange}
				name="content"
				rows={5}
				value={messageContent}
			/>

			<Button variant="contained" color="primary" style={styles.send} onClick={onSubmit}>
				<SendIcon fontSize="large"/>
			</Button>
		</div>
	)
};

export default MessageForm;

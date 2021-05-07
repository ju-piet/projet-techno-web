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

const Channel = ({channel}) => {
	const [messages, setMessages] = useState([]);
	const token = useContext(TokenContext);
	const user = useContext(UserContext);

	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/channels/'+ channel.id +'/messages', {
			headers: {
				authorization: "Bearer " + token
			}
		}).then(response => {
			if(user.id===channel.owner || channel.members.includes(user.id)){
				console.log("les message", response.data)
				setMessages(response.data);
			}
			else{
				setMessages("You doesn't have access to this channel!");
			}
		})
	}, [channel]);

	const onAddMessage = newMessage => {
		// fetch messages
		axios.get('http://localhost:8000/api/v1/channels/'+ channel.id +'/messages')
		.then(response => {
			console.log("dand s", response)
			setMessages(response.data);
		})

	};

	const deleteMessage = (messageId) => {
		const currentMessages = messages.filter(message => message.id !== messageId)
		setMessages(currentMessages);
	}

	return (
		<div style={styles.channel}>
			<div style={user.isDay ? styles.messagesDay : styles.messagesNight}>
				{user.lang === 'EN' && (
					<h1>Messages for : {channel.name}</h1>
				)}

				{user.lang === 'FR' && (
					<h1>Les messages de : {channel.name}</h1>
				)}
				<Messages messages={messages} deleteMessage={deleteMessage} />
			</div>
			<MessageForm onAddMessage={onAddMessage} channel={channel} />
		</div>
	);
};

export default Channel;

import React, {useState, useEffect} from 'react';
import Messages from '../message/Messages';
import MessageForm from '../message/MessageForm';
import axios from 'axios';

const styles = {
	channel: {
		height: '100%',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden'
	},
	messages: {
		flex: '1 1 auto',
		height: '100%',
		overflow: 'auto',
		'& ul': {
			'margin': 0,
			'padding': 0,
			'textIndent': 0,
			'listStyleType': 0
		}
	},
};

const Channel = ({channel}) => {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/channels/'+ channel.id +'/messages', {
		}).then(response => {
			setMessages(response.data);
		})
	}, [channel]);

	const addMessage = newMessage => {

		axios.post('http://localhost:8000/api/v1/messages', {
			channel_id: channel.id,
			content: newMessage.content,
		});

		setMessages([
			...messages,
			newMessage
		]);
	};

	const deleteMessage = (messageId) => {
		const currentMessages = messages.filter(message => message.id !== messageId)
		setMessages(currentMessages);
	}

	return (
		<div style={styles.channel}>
			<div style={styles.messages}>
				<h1>Messages for {channel.name}</h1>
				<Messages messages={messages} deleteMessage={deleteMessage} />
			</div>
			<MessageForm addMessage={addMessage} channel={channel} />
		</div>
	);
};

export default Channel;

import React from 'react';
import Message from './Message';

// Messages
const Messages = ({messages, deleteMessage}) => (
	// On affiche nos messages
	<ul>
		{messages.map(message => (
			<Message key={message.id} message={message} deleteMessage={deleteMessage} />
		))}
	</ul>
);

export default Messages;

import React from 'react';
import Message from './Message';

const Messages = ({messages, deleteMessage}) => (
	<ul>
		{messages.map(message => (
			<Message key={message.id} message={message} deleteMessage={deleteMessage} />
		))}
	</ul>
);

export default Messages;

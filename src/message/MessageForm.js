import React, {useState, useContext} from 'react';
import {UserContext} from '../Contexts'

const styles = {
	form: {
		borderTop: '2px solid #373B44',
		padding: '.5rem',
		display: 'flex',
		width:'100%'
	},
	textarea: {
		width:'100%'
	},
	send: {
		backgroundColor: '#D6DDEC',
		padding: '.2rem .5rem',
		border: 'none',
		width:'150px',
		':hover': {
			backgroundColor: '#2A4B99',
			cursor: 'pointer',
			color: '#fff'
		},
	},
};

const MessageForm = ({addMessage}) => {
	const [content, setContent] = useState('');
	const user = useContext(UserContext);

	//You can improve this function with one hook (useCallback) :
	// https://fr.reactjs.org/docs/hooks-intro.html
	// https://fr.reactjs.org/docs/hooks-reference.html
	const onSubmit = () => {
		addMessage({
			content,
			author: user.name,	//Il faudra récupérer le user
			creation: Date.now(),
		});

		setContent('');
	};

	//You can improve this function with one hook (useCallback) :
	const onChange = (e) => {
		setContent(e.target.value);
	};

	return (
		<div style={styles.form}>
            <textarea 
				style={styles.textarea}
				onChange={onChange}
				name="content"
				rows={5}
				value={content}
			/>
			<button onClick={onSubmit} type="submit" style={styles.send}>
				Send
			</button>
		</div>
	)
};

export default MessageForm;

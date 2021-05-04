import React, {useState, useEffect, useCallback, useContext} from 'react';
import {UserContext} from '../Contexts'
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';

const styles = {
	channels: {
		display: 'flex',
		flexDirection:'column',
		justifyContent:'space-between',
		borderRight: '3px solid white'
	},

	buttons: {
		display: 'flex',
		flexDirection:'column',
	},

	button: {
		backgroundColor: 'rgba(255,255,255,.3)',
		color:'white',
		fontSize:'medium',
		margin:5,
	},

	toolbar: {
		width:'fitContent',
		textAlign: 'center',
	},

	addChannel:{
		display: 'flex',
		flexDirection:'column',
	},

	infoChannel:{
		display: 'flex',
		flexDirection:'row',
		margin:5,
	}
};

const Channels = ({ handleClick }) => {
	const [channels, setChannels] = useState([]); //Initialiser à vide avant de pouvoir les récuperer
	const [channelName, setChannelName] = useState('');	
	const [channelOwner, setChannelOwner] = useState('');	
	const [channelMember, setChannelMember] = useState('')
	const [channelMembers, setChannelMembers] = useState([]);
	const [message, setMessage] = useState('');	
	const [isActivated, setActivate] = useState(false);	

	const user = useContext(UserContext);

	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/channels', {
		}).then(response => {
			//const myChannels = response.data.filter(channel => channel.members.includes(user.name))
			setChannels(response.data);
		})
	}, []);

	const onSelectChannel = useCallback(
		channel => handleClick(channel),
		[],
	);

	const onSubmit = () => {
		setChannelOwner(user.id);

		axios.post('http://localhost:8000/api/v1/channels', {
			name: channelName,
			owner: channelOwner,
			members: channelMembers,
		});

		setChannelName('');
		setChannelMember('');
		setChannelMembers([]);
		setActivate(false);
	};

	const createChannel = () => {
		if(isActivated === false){
			setActivate(true);
		}
		else{
			setActivate(false);
		}
	};

	const addMember = () => {
		//On va chercher le userId avec son email		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember, {
		}).then(response => {
			//On set le channel members avec l'ID
			setChannelMembers([
				...channelMembers,
				response.data
			])
			setMessage('member added!')
		})
	};

	return (
		<div style={styles.channels}>

			<div style={styles.buttons}>
				{
					channels.map(channel => (
						<button style={styles.button} key={channel.id} onClick={() => onSelectChannel(channel)}>
							{channel.name}
						</button>
					))
				}
			</div>

			<div style={styles.addChannel}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h7">
							<Button color="inherit" onClick={createChannel}>
								<ExpandMoreIcon/>
								CREATE A NEW CHANNEL
							</Button>
    					</Typography>
					</Toolbar>
				</AppBar>

				{isActivated && (
				<div>
					<div style={styles.infoChannel}>
						<label for="channel">Channel name :</label><br />
						<input
							type="text"
							onChange={(e) => {setChannelName(e.target.value)}}
							name="channelName"
							style={styles.input}
							value={channelName}
						/>
					</div>

					<div style={styles.infoChannel}>
						<label for="channel">Member email :</label><br />
						<input
							type="text"
							onChange={(e) => {setChannelMember(e.target.value)}}
							name="channelMember"
							style={styles.input}
							value={channelMember}
						/>
						<button style={styles.button} type="submit" onClick={addMember}>
							Add a member
						</button>

						<p>{message}</p>
					</div>

					<button style={styles.button} type="submit" onClick={onSubmit}>
						Add channel
					</button>
				</div>)}

			</div>
		</div>
	);
}

export default Channels;

import React, {useState, useEffect, useCallback, useContext} from 'react';
import {TokenContext, UserContext} from '../Contexts'
import { AppBar, Toolbar, Typography, Button, TextField } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';

const styles = {
	channels: {
		display: 'flex',
		flexDirection:'column',
		justifyContent:'space-between',
		borderRight: '2px solid black',
		backgroundColor: '#FFFAF0'	
	},
	buttons: {
		display: 'flex',
		flexDirection:'column',
		margin:5,
	},
	button : {
		display: 'flex',
		flexDirection:'column',
		margin:5,
		color:'#000000',
		backgroundColor: '#6495ED'	
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
		flexDirection:'column',
		margin:5,
	},
	grp:{
		display: 'flex',
		flexDirection:'row',
	},
	input:{
		color:'#000000',
		margin:5
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
	const token = useContext(TokenContext);

	useEffect(() => {

		axios.get('http://localhost:8000/api/v1/channels').then(response => {
			//const myChannels = response.data.filter(channel => channel.members.includes(user.name))
			setChannels(response.data);
		})
		.catch(err => {
			console.log("caca", err)
		})
	}, []);


	console.log("before", axios.defaults.headers.common['authorization'])

	const onSelectChannel = useCallback(
		channel => axios.get('http://localhost:8000/api/v1/channels/' + channel.id).then(response => {
			console.log(response)

			handleClick(response.data)
			//const myChannels = response.data.filter(channel => channel.members.includes(user.name))
			//setChannels(response.data);
		}),
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

		axios.get('http://localhost:8000/api/v1/channels', {
		}).then(response => {
			//const myChannels = response.data.filter(channel => channel.members.includes(user.name))
			setChannels(response.data);
		})
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
			console.log(response.data)
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
						<Button variant="contained" color="primary" key={channel.id} style={styles.button} onClick={() => onSelectChannel(channel)}>
  							{channel.name}
						</Button>
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
				<div style={styles.infoChannel}>
					<div style={styles.grp}>
						<TextField 
							label="Channel name" 
							variant="outlined"
							size="small"
							type="text"
							onChange={(e) => {setChannelName(e.target.value)}}
							name="channelName"
							style={styles.input}
							value={channelName}
						/>
					</div>

					<div>
						<div style={styles.grp}>
							<TextField 
								label="Member email" 
								variant="outlined"
								size="small"
								type="text"
								onChange={(e) => {setChannelMember(e.target.value)}}
								name="channelMember"
								style={styles.input}
								value={channelMember}
							/>
						</div>

						<div style={styles.grp}>
							<Button variant="contained" color="primary" style={styles.button} onClick={addMember}>
								Add a member
							</Button>

							<p style={styles.input}>{message}</p>
						</div>
					</div>

					<Button variant="contained" color="primary" style={styles.button} onClick={onSubmit}>
						Add channel
					</Button>
				</div>)}

			</div>
		</div>
	);
}

export default Channels;

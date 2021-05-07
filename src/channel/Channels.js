import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TokenContext, UserContext } from '../Contexts'
import { AppBar, Toolbar, Typography, Button, TextField } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';

const styles = {
	channelsDay: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderRight: '2px solid black',
		backgroundColor: '#FFFAF0'
	},
	channelsNight: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderRight: '2px solid black',
		backgroundColor: '#4169E1',
	},
	buttonDay: {
		display: 'flex',
		flexDirection: 'column',
		margin: 5,
		color: '#000000',
		backgroundColor: '#6495ED'
	},
	buttonNight: {
		display: 'flex',
		flexDirection: 'column',
		margin: 5,
		color: '#ffffff',
		backgroundColor: '#663399'
	},
	toolbar: {
		width: 'fitContent',
		textAlign: 'center',
	},

	addChannel: {
		display: 'flex',
		flexDirection: 'column',
	},

	infoChannel: {
		display: 'flex',
		flexDirection: 'column',
		margin: 5,
	},
	grp: {
		display: 'flex',
		flexDirection: 'row',
		margin: 5
	},
	input: {
		margin: 5
	},
	positionedDay: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		border: '2px solid black',
		color: 'black',
		backgroundColor: '#FFFAF0',
		padding: 10
	},
	positionedNight: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		border: '2px solid black',
		color: 'white',
		backgroundColor: '#4169E1',
		padding: 10
	}
};

const Channels = ({ handleClick, setError }) => {
	const [channels, setChannels] = useState([]); //Initialiser à vide avant de pouvoir les récuperer
	const [channelName, setChannelName] = useState('');
	const [channelMember, setChannelMember] = useState('')
	const [channelMemberName, setChannelMemberName] = useState([])
	const [channelMembers, setChannelMembers] = useState([]);
	const [message, setMessage] = useState('');
	const [isActivated, setActivate] = useState(false);
	const [isActivatedPopup, setActivatePopup] = useState(false);
	const [error2, setError2] = useState(false);

	const user = useContext(UserContext);
	const token = useContext(TokenContext);

	useEffect(() => {

		axios.get('http://localhost:8000/api/v1/channels').then(response => {
			setChannels(response.data);
		})
	}, []);

	const onSelectChannel = useCallback(
		channel => axios.get('http://localhost:8000/api/v1/channels/' + channel.id)
			.then(response => {
				handleClick(response.data)
				setError(false);
			})
			.catch(err =>{
				console.log('yo')
				console.log(setError)
				setError(true);
			}),
		[],
	);

	const deleteChannel = (channel) => {
        axios.delete('http://localhost:8000/api/v1/channels/' + channel.id);
    }

	const onSubmit = () => {
		setActivatePopup(true);
	};

	const publishChannel = () => {

		axios.post('http://localhost:8000/api/v1/channels', {
			name: channelName,
			owner: user.id,
			members: channelMembers,
		})
		.then(response => {
			setChannelName('');
			setChannelMember('');
			setChannelMembers([]);
			setActivate(false);
			setActivatePopup(false);
	
			axios.get('http://localhost:8000/api/v1/channels', {
			}).then(response => {
				setChannels(response.data);
			})
		})
	}

	const cancelpublish = () => {
		setActivatePopup(false);
	}

	const createChannel = () => {
		if (isActivated === false) {
			setActivate(true);
		}
		else {
			setActivatePopup(false);
			setActivate(false);
		}
	};

	const addMember = () => {
		//On va chercher le userId avec son email		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember, {
		}).then(response => {
			console.log(response.data.name)
			//On set le channel members avec l'ID
			setChannelMembers([
				...channelMembers,
				response.data.id
			])
			setChannelMemberName([
				...channelMemberName,
				response.data.name
			])
			setMessage('member added!')
		})
	};

	return (
		<div style={user.isDay ? styles.channelsDay : styles.channelsNight}>

			<div>
				{
					channels.map(channel => (
						<div style={{display:'flex', flexDirection: 'row', alignItems: 'stretch', width: '100%'}}>
							<Button style={{width:'100%'}}
								variant="contained"
								color="primary" 
								key={'but1' + channel.id}
								style={user.isDay ? styles.buttonDay : styles.buttonNight}
								onClick={() => onSelectChannel(channel)}
							>
								{channel.name}
							</Button>
							<Button 
								variant="contained"
								color="primary" 
								key={'but2' + channel.id}
								style={{backgroundColor: '#DC143C', color:'#000000'}}
								onClick={() => deleteChannel(channel)}
							>
							<DeleteIcon />
						</Button>
						</div>
					))
				}
			</div>

			<div style={styles.addChannel}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h7">
							{user.lang === 'EN' && (
								<Button color="inherit" onClick={createChannel}>
									<ExpandMoreIcon />
									CREATE A NEW CHANNEL
								</Button>
							)}

							{user.lang === 'FR' && (
								<Button color="inherit" onClick={createChannel}>
									<ExpandMoreIcon />
									CREER UNE NOUVELLE CHAINE
								</Button>
							)}
						</Typography>
					</Toolbar>
				</AppBar>

				{isActivated && (
					<div style={styles.infoChannel}>
						<div style={styles.grp}>
							{user.lang === 'EN' && (
								<TextField
									label="Channel name"
									variant="outlined"
									size="small"
									type="text"
									onChange={(e) => { setChannelName(e.target.value) }}
									name="channelName"
									style={styles.input}
									value={channelName}
								/>
							)}

							{user.lang === 'FR' && (
								<TextField
									label="Nom de la chaine"
									variant="outlined"
									size="small"
									type="text"
									onChange={(e) => { setChannelName(e.target.value) }}
									name="channelName"
									style={styles.input}
									value={channelName}
								/>
							)}
						</div>

						<div >
							<div>
								{user.lang === 'EN' && (
									<TextField
										label="Member email"
										variant="outlined"
										size="small"
										type="text"
										onChange={(e) => { setChannelMember(e.target.value) }}
										name="channelMember"
										style={styles.input}
										value={channelMember}
									/>
								)}

								{user.lang === 'FR' && (
									<TextField
										label="Email du membre"
										variant="outlined"
										size="small"
										type="text"
										onChange={(e) => { setChannelMember(e.target.value) }}
										name="channelMember"
										style={styles.input}
										value={channelMember}
									/>
								)}
							</div>

							<div >
								{user.lang === 'EN' && (
									<Button
										variant="contained"
										color="primary"
										style={user.isDay ? styles.buttonDay : styles.buttonNight}
										onClick={addMember}
									>
										Add a member
									</Button>
								)}

								{user.lang === 'FR' && (
									<Button
										variant="contained"
										color="primary"
										style={user.isDay ? styles.buttonDay : styles.buttonNight}
										onClick={addMember}
									>
										Ajouter un membre
									</Button>
								)}

								<p style={styles.input}>{message}</p>
							</div>
						</div>

						{user.lang === 'EN' && (
							<div>
							<Button
								variant="contained"
								color="primary"
								style={user.isDay ? styles.buttonDay : styles.buttonNight}
								onClick={onSubmit}
							>
								Add channel
							</Button>

							{error2 && <p>Veuillez ajouter un nom de chaine</p>}
							</div>
						)}

						{user.lang === 'FR' && (
							<div>
								<Button
									variant="contained"
									color="primary"
									style={user.isDay ? styles.buttonDay : styles.buttonNight}
									onClick={onSubmit}
								>
									Ajouter un channel
								</Button>
								
								{error2 && <p>Veuillez ajouter un nom de chaine</p>}
							</div>
						)}

						{isActivatedPopup && (
							<div style={user.isDay ? styles.positionedDay : styles.positionedNight}>
								{user.lang === 'EN' && (
									<div>
										<p style={{ fontSize: 'large' }}>Do you want add this channel ?</p>
										<div>
											<p>Name : {channelName}</p>
											<p>Owner : {user.name}</p>
											<p>Members : {channelMemberName.join(', ')}</p>
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<Button
												variant="contained"
												color="primary"
												style={user.isDay ? styles.buttonDay : styles.buttonNight}
												onClick={publishChannel}
											>
												Validate
											</Button>
											<Button
												variant="contained"
												color="primary"
												style={user.isDay ? styles.buttonDay : styles.buttonNight}
												onClick={cancelpublish}
											>
												Cancel
											</Button>
										</div>
									</div>
								)}

								{user.lang === 'FR' && (
									<div>
										<p style={{ fontSize: 'large' }}>Voulez vous ajouter ce channel ?</p>
										<div>
											<p>Nom : {channelName}</p>
											<p>Créateur : {user.name}</p>
											<p>Membres : {channelMemberName.join(', ')}</p>
										</div>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<Button
												variant="contained"
												color="primary"
												style={user.isDay ? styles.buttonDay : styles.buttonNight}
												onClick={publishChannel}
											>
												Valider
											</Button>
											<Button
												variant="contained"
												color="primary"
												style={user.isDay ? styles.buttonDay : styles.buttonNight}
												onClick={cancelpublish}
											>
												Annuler
											</Button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Channels;

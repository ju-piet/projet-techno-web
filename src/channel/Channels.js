import React, { useState, useEffect, useCallback, useContext } from 'react';
import { UserContext } from '../Contexts'
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
		backgroundColor: '#663399',
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
	grpBtn: {
		display: 'flex',
		flexDirection: 'column',
	},
	grpText: {
		display: 'flex',
		flexDirection: 'row',
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

const texts = {
	"FR": {
		"createChannel": "CREER UNE NOUVELLE CHAINE",
		"nameChannel": "Nom de la chaine",
		"email": "Email du membre",
		"addMember":"Ajouter un membre",
		"addChannel":"Ajouter une chaine",
		"ask":"Voulez vous ajouter ce chaine ?",
		"name":"Nom : ",
		"owner":"Créateur : ",
		"members":"Membres : ",
		"validate":"Valider",
		"cancel":"Annuler"
	},

	"EN": {
		"createChannel": "CREATE A NEW CHANNEL",
		"nameChannel": "Channel name",
		"email": "Member email",
		"addMember":"Add a member",
		"addChannel":"Add a channel",
		"ask":"Do you want add this channel ?",
		"name":"Name : ",
		"owner":"Owner : ",
		"members":"Members : ",
		"validate":"Validate",
		"cancel":"Cancel"
	},
}

const Channels = ({ handleClick, setError }) => {
	/* On initialise nos states channel */
	const [channels, setChannels] = useState([]); 
	const [channelName, setChannelName] = useState('');
	const [channelMember, setChannelMember] = useState('')
	const [channelMemberName, setChannelMemberName] = useState([])
	const [channelMembers, setChannelMembers] = useState([]);

	/* On initialise nos states message */
	const [messageMember, setMessageMember] = useState('');
	const [messageChannel, setMessageChannel] = useState('');

	/* On initialise nos states popup */
	const [isActivatedCreate, setActivate] = useState(false);
	const [isActivatedPopupValidate, setActivatePopup] = useState(false);

	// On initialise notre contexts
	const user = useContext(UserContext);

	// A chaque chargement du composant...
	useEffect(() => {
		//... on récupère nos channels en base
		axios.get('http://localhost:8000/api/v1/channels').then(response => {
			//... on set nos channels
			setChannels(response.data);
		})
	}, [channels]);

	// Lorsqu'on sélectionne un channel...
	const onSelectChannel = useCallback(
		//... on récupère le channel sélectionné en base
		channel => axios.get('http://localhost:8000/api/v1/channels/' + channel.id)
			.then(response => {
				//... on renvoie la réponse au parent du composant (Main)
				handleClick(response.data)
				//... on renvoie l'erreur au parent
				setError(false);
			})
			.catch(err =>{
				console.log(err)
				//... on renvoie l'erreur au parent
				setError(true);
			}),
		[handleClick,setError],
	);

	// Lorsqu'on supprime un channel...
	const deleteChannel = (channel) => {
		//... on le supprime en base
        axios.delete('http://localhost:8000/api/v1/channels/' + channel.id);
    }

	// Lorsqu'on clique sur le bouton ajouter un channel, on lance une popup...
	const launchPopup = () => {
		//... si on a pas rentré un nom de channel
		if(!channelName){
			if(user.lang === 'EN'){
				//... on set un message (en anglais)
				setMessageChannel('You must give a name to the channel')
			}
			else{
				//... on set un message (en français)
				setMessageChannel('Vous devez donner un nom à la chaine')
			}
		}
		//... si on a pas rentré un nom de channel
		else{
			setActivatePopup(true);
		}
	};

	// Lorsqu'on clique sur le bouton valider
	const publishChannel = () => {
		// On poste le channel en base
		axios.post('http://localhost:8000/api/v1/channels', {
			name: channelName,
			owner: user.id,
			members: channelMembers,
		})
		.then(response => {

			/* On set les informations du channel */
			setChannelName('');
			setChannelMember('');
			setChannelMembers([]);

			/* On set les messages d'information */
			setMessageMember('');
			setMessageChannel('');

			/* On set les messages d'information */
			setActivate(false);
			setActivatePopup(false);
	
			// On récupère les channels
			axios.get('http://localhost:8000/api/v1/channels', {
			}).then(response => {
				setChannels(response.data);
			})
		})
	}

	// Lorsqu'on clique sur le bouton annuler
	const cancelpublish = () => {
		// On ferme la popup
		setActivatePopup(false);
	}

	const createChannel = () => {
		if (isActivatedCreate === false) {
			setActivate(true);
		}
		else {
			setActivatePopup(false);
			setActivate(false);
		}
	};

	const addMember = () => {
		//On récupère le userId avec son email dans la base...		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember, {
		}).then(response => {
			// si le member n'est pas déja membre...
			if(!channelMembers.includes(response.data.id)){
				//... on set la liste des membres avec l'ID du user récupéré
				setChannelMembers([
					...channelMembers,
					response.data.id
				])
				//... on set le nom du membre avec le user récupéré
				setChannelMemberName([
					...channelMemberName,
					response.data.name
				])

				if(user.lang === 'EN'){
					//... on set le message d'information du membre (anglais)
					setMessageMember('member added!')
				}
				else{
					//... on set le message d'information du membre (français)
					setMessageMember('membre ajouté !')
				}
			}
			// sinon si le member est pas déja membre du channel...
			else{		
				if(user.lang === 'EN'){
					//... on set le message d'information du membre (anglais)
					setMessageMember('member already added!')
				}
				else{
					//... on set le message d'information du membre (français)
					setMessageMember('membre déjà ajouté !')
				}
			}
		})
	};

	// On affiche nos channels
	return (
		<div style={user.isDay ? styles.channelsDay : styles.channelsNight}>
			<div>
				{
					channels.map(channel => (
						<div style={{display:'flex', flexDirection: 'row', alignItems: 'stretch', width: '100%'}}>
							<Button 
								variant="contained"
								color="primary" 
								key={'but1' + channel.id}
								fullWidth
								style={user.isDay ? styles.buttonDay : styles.buttonNight}
								onClick={() => onSelectChannel(channel)}
							>
								{channel.name}
							</Button>
							{channel.owner === user.id &&(
								<Button 
									variant="contained"
									size="small"
									color="primary" 
									key={'but2' + channel.id}
									style={{backgroundColor: '#DC143C', color:'#000000', margin:5}}
									onClick={() => deleteChannel(channel)}
								>
								<DeleteIcon fontSize="small" />
							</Button>
							)}
						</div>
					))
				}
			</div>

			<div style={styles.addChannel}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="subtitle1">
								<Button color="inherit" onClick={createChannel}>
									<ExpandMoreIcon />
									{texts[user.lang]["createChannel"]}
								</Button>

						</Typography>
					</Toolbar>
				</AppBar>

				{/*	La popup de création de channel */}
				{isActivatedCreate && (
					<div style={styles.infoChannel}>
						<div style={styles.grpBtn}>
							<TextField
								label={texts[user.lang]["nameChannel"]}
								variant="outlined"
								size="small"
								type="text"
								onChange={(e) => { 
									setChannelName(e.target.value) 
									setMessageChannel('')
								}}
								name="channelName"
								style={styles.input}
								value={channelName}
								/>

							<TextField
								label={texts[user.lang]["email"]}
								variant="outlined"
								size="small"
								type="text"
								onChange={(e) => { 
									setChannelMember(e.target.value)
									setMessageMember('')
								}}
								name="channelMember"
								style={styles.input}
								value={channelMember}
							/>
						</div>


						<div style={styles.grpText}>
							<Button
								variant="contained"
								color="primary"
								style={user.isDay ? styles.buttonDay : styles.buttonNight}
								onClick={addMember}
							>
								{texts[user.lang]["addMember"]}
							</Button>

							<p style={user.isDay ? {color:'black'} : {color:'white'}}>{messageMember}</p>
						</div>

						<div>
							<Button
								variant="contained"
								color="primary"
								style={user.isDay ? styles.buttonDay : styles.buttonNight}
								onClick={launchPopup}
							>
								{texts[user.lang]["addChannel"]}
							</Button>

							<p style={user.isDay ? {color:'black'} : {color:'white'}}>{messageChannel}</p>
						</div>

						{/*	La popup de validation du channel */}
						{isActivatedPopupValidate && (
							<div style={user.isDay ? styles.positionedDay : styles.positionedNight}>
								<div>
									<p style={{ fontSize: 'large' }}>{texts[user.lang]["ask"]}</p>
									<div>
										<p>{texts[user.lang]["name"]} {channelName}</p>
										<p>{texts[user.lang]["owner"]} {user.name}</p>
										<p>{texts[user.lang]["members"]} {channelMemberName.join(', ')}</p>
									</div>

									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<Button
											variant="contained"
											color="primary"
											style={user.isDay ? styles.buttonDay : styles.buttonNight}
											onClick={publishChannel}
										>
											{texts[user.lang]["validate"]}
										</Button>

										<Button
											variant="contained"
											color="primary"
											style={user.isDay ? styles.buttonDay : styles.buttonNight}
											onClick={cancelpublish}
										>
											{texts[user.lang]["cancel"]}
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default Channels;

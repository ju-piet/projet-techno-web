import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, TextField, InputLabel, Select, Avatar } from '@material-ui/core'
import PowerOffIcon from '@material-ui/icons/PowerOff';
import SwitchCompo from '@material-ui/core/Switch';
import { UserContext } from '../Contexts'
import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

const styles = {
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	header: {
		backgroundColor: 'rgba(255,255,255,.3)',
		textAlign: 'center',
		flexShrink: 0,
		borderBottom: '2px solid black',
	},
	inviteDay: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		borderBottom: '2px solid black',
		backgroundColor: '#87CEFA',
		color: 'black',
		width: '100%',
		padding: 10,
	},
	inviteNight: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		borderBottom: '2px solid black',
		backgroundColor: '#7B68EE',
		color: 'white',
		width: '100%',
		padding: 10,
	},
	input: {
		margin: 5,
		color: 'white'
	},
	switch: {
		display: 'flex'
	},
};


const texts = {
	"FR": {
		"userName": "Nom de l'utilisateur",
		"userPassword": "Mot de passe",
		"modif": "Modifier",
		"quit": "Quitter",
		"lightmode": "Mode claire",
		"darkmode": "Mode sombre",
		"fr": "Francais",
		"en": "Anglais",
		"valider": "Sauvegarder les préférences",
		"addMember":"Ajouter un membre",
		"choix":"Choisissez une chaine",
		"emailMember": "Email du membre",
		"invite":"Inviter un membre",
		"change":"Changer vos informations",
		"logout":"Déconnexion",
		"avatar":"Sélectionnez votre avatar"
	},

	"EN": {
		"userName": "User name",
		"userPassword": "User password",
		"modif": "Modify",
		"quit": "Quit",
		"lightmode": "Light mode",
		"darkmode": "Dark mode",
		"fr": "French",
		"en": "English",
		"valider": "Save preferences",
		"addMember":"Add a member",
		"choix":"Choose a channel",
		"emailMember": "Member email",
		"invite":"Invite a member",
		"change":"Changer your informations",
		"logout":"Logout",
		"avatar":"Sélectionnez votre avatar"
	},
}

export default function Header({ setUser, setContinued}) {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/">
						<MyHeader setUser={setUser} setContinued={setContinued}/>
					</Route>
					<Route path="/invite">
						<Invite />
					</Route>
					<Route path="/change">
						<ChangeUserInfo setUser={setUser} />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

//Header
function MyHeader({ setUser, setContinued}) {
	// On initialise notre context user
	const user = useContext(UserContext);

	// On initialise notre state
	const [anchorEl, setAnchorEl] = useState(null);

	// Lorsqu'on clique sur notre bouton logout...
	const logout = () => {
		//... on réinitialise notre user 
		setUser(null)
		//... on réinitialise notre bool d'accès à la page welcome 
		setContinued(false)
		//... on supprime notre token dans le local storage
		window.localStorage.removeItem('token');
	}

	//Lorsqu'on clique sur notre profil...
	const handleClick = (event) => {
		//... on affiche nos menu items
		setAnchorEl(event.currentTarget);
	};

	//Lorsqu'on ferme notre menu...
	const handleClose = () => {
		//... on set notre state à null
		setAnchorEl(null);
	};

	//On affiche notre header
	return (
		<header className="app-header" style={styles.header}>
			<AppBar position="static" >
				<Toolbar style={styles.toolbar}>
					<Typography variant="h5">
						AppChat
    				</Typography>

					<div>
						<Button color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
							<Avatar style={{background: 'orange'}}>{user.name[0]}</Avatar>{user.name}					
						</Button>
						<Menu
							id="simple-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<Link to="/invite">				
								<MenuItem onClick={handleClose}>{texts[user.lang]["invite"]}</MenuItem>
							</Link>

							<Link to="/change">
								<MenuItem onClick={handleClose}>{texts[user.lang]["change"]}</MenuItem>
							</Link>
						</Menu>
							<Button color="inherit" onClick={logout}>
								<PowerOffIcon />
								{texts[user.lang]["logout"]}
							</Button>
					</div>
				</Toolbar>
			</AppBar>
		</header>
	);
}

// Page invitation d'un membre
function Invite() {
	// On initialise notre context user
	const user = useContext(UserContext);

	/* On initialise les states channel */
	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState([]);
	const [channelMember, setChannelMember] = useState('');
	const [channelMemberId, setChannelMemberId] = useState('');

	// On initialise le state message d'info
	const [message, setMessage] = useState('');

	useEffect(() => {
		// Lorsqu'on charge le compiosant, on récupère les channels en base
		axios.get('http://localhost:8000/api/v1/channels', {
		}).then(response => {
			setChannels(response.data);
		})
	}, []);

	const addMember = () => {
		//On va chercher le userId avec son email...		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember).then(response => {
			setChannelMemberId(response.data.id);

			//... on update les membre du channel avec le userId récupéré...
			axios.put('http://localhost:8000/api/v1/channels/' + selectedChannel.id, {
				name: selectedChannel.name,
				member: channelMemberId
			}).then(response => {
				//... lorsqu'il est ajouté on set le message d'ajout et le membre (car il est ajouté)
				setMessage(response.data)
				setChannelMember('')
			})
			.catch(err => {
				console.log(err)
			})
		})
		.catch(err => {
			console.log(err)
		})
	};

	// On affiche la page d'invitation
	return (
		<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
			
			<InputLabel id="demo-controlled-open-select-label">
				{texts[user.lang]["choix"]}
			</InputLabel>

			<Select
				variant="outlined"
				labelId="demo-controlled-open-select-label"
				id="demo-controlled-open-select"
				value={selectedChannel}
				onChange={e => setSelectedChannel(e.target.value)}
			>
				{
					channels.map(channel => (
						<MenuItem value={channel} key={channel.id}>
							{channel.name}
						</MenuItem>
					))
				}

			</Select>
				<div>
					<TextField
						label={texts[user.lang]["emailMember"]}
						variant="outlined"
						size="small"
						type="text"
						onChange={(e) => { setChannelMember(e.target.value) }}
						name="channelMember"
						style={styles.input}
						value={channelMember}
					/>

					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', margin: 5 } : { backgroundColor: '#663399', margin: 5 }}
						onClick={addMember}
					>
						{texts[user.lang]["addMember"]}
					</Button>

					{message}
				</div>

			<Link to="/">
				<Button
					variant="contained"
					color="primary"
					style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
				>
					{texts[user.lang]["quit"]}
				</Button>
			</Link>
		</div>
	);
}

// Page de changment d'informations user
function ChangeUserInfo({ setUser }) {
	// On initialise le context
	const user = useContext(UserContext);

	/* On initialise les states user */
	const [userName, setUserName] = useState('');
	const [userPassword, setUserPassword] = useState('');

	// On initialise le state message
	const [message, setMessage] = useState('');

	// Lorsqu'on clique sur le switch du theme...
	const handleChangeMode = () => {
		//... si le user avait le light mode...
		if (user.isDay === true) {
			//... on set le theme user est en dark
			setUser({
				...user,
				isDay: false
			})
		}
		else {
			//... on set le theme user est en light
			setUser({
				...user,
				isDay: true
			})
		}
	};

	// Lorsqu'on clique sur le switch de langue...
	const handleChangeLang = () => {
		//... si le user avait la langue en anglais...
		if (user.lang === 'EN') {
			//... on set la langue user est en français
			setUser({
				...user,
				lang: 'FR'
			})
		}
		//... si le user avait la langue en français...
		else {
			setUser({
				//... on set la langue user est en anglais
				...user,
				lang: 'EN'
			})
		}
	};

	// Lorsqu'on clique sur le bouton de sauvegarde de préférences...
	const savePref = () => {
		//... on update notre user en base...
		axios.put('http://localhost:8000/api/v1/users/' + user.id, {
			name: user.name,
			password: user.password,
			isDay: user.isDay,
			lang: user.lang,
		})
		//... si l'update n'est pas possible, on set un message d'erreur
		.catch((error) => setMessage(
			error.response.data.message
		));
	};

	// Lorsqu'on clique sur le bouton modifier...
	const changeUser = () => {
		//... on modifie le user en base
		axios.put('http://localhost:8000/api/v1/users/' + user.id, {
			name: userName,
			password: userPassword,
		})
		//... on set un message avec ce que nous renvoie le back
		.then(response => {
			setMessage(response.data.message);
		})
		//... si l'update n'est pas possible, on set un message d'erreur
		.catch((error) => setMessage(error.response.data.message));
	}

	const changeAvatar = (name) => {
		console.log(name)
	}

	//On affiche notre page changement d'informations
	return (
		<div style={{ display: 'flex'}}>
				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<TextField
						style={{ width: 375, margin: 5 }}
						label={texts[user.lang]["userName"]}
						variant="outlined"
						size="small"
						type="text"
						onChange={(e) => { setUserName(e.target.value) }}
						name="channelMember"
						value={userName}
					/>

					<TextField
						style={{ width: 375, margin: 5 }}
						label={texts[user.lang]["userPassword"]}
						variant="outlined"
						size="small"
						type="password"
						onChange={(e) => { setUserPassword(e.target.value) }}
						name="channelMember"
						value={userPassword}
					/>

					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
						onClick={changeUser}
					>
						{texts[user.lang]["modif"]}
					</Button>

					<Link to="/">
						<Button
							variant="contained"
							color="primary"
							style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
						>
							{texts[user.lang]["quit"]}
						</Button>
					</Link>
					<p>{message}</p>
				</div>

				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<div style={styles.switch}>
						<p>{texts[user.lang]["lightmode"]}</p>
						<SwitchCompo
							onChange={handleChangeMode}
							name="isDay"
							checked={!user.isDay}
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>{texts[user.lang]["darkmode"]}</p>
					</div>
					<div style={styles.switch}>
						<p>{texts[user.lang]["fr"]}</p>
						<SwitchCompo
							onChange={handleChangeLang}
							checked={user.lang === "EN"}
							name="language"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>{texts[user.lang]["en"]}</p>
					</div>
					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', width: 230 } : { backgroundColor: '#663399', width: 230 }}
						onClick={savePref}
					>
						{texts[user.lang]["valider"]}
					</Button>
				</div>

				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<h3>{texts[user.lang]["avatar"]}</h3>
					<Button onClick={() => changeAvatar('/pic1.jpg')}>
						<Avatar src="/pic1.jpg"/>
					</Button>
					<Button onClick={() =>changeAvatar('/pic2.jpg')}>
						<Avatar src="/pic2.jpg"/>
					</Button>
					<Button onClick={() => changeAvatar('/pic3.jpg')}>
						<Avatar src="/pic3.jpg"/>
					</Button>
				</div>
		</div>
	);
};



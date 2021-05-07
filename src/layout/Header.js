import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, TextField, InputLabel, Select, useRadioGroup, Avatar } from '@material-ui/core'
import PowerOffIcon from '@material-ui/icons/PowerOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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
		borderBottom: '2px solid black',
		backgroundColor: '#87CEFA',
		color: 'black',
		width: '100%',
		padding: 10,
	},
	inviteNight: {
		display: 'flex',
		flexDirection: 'column',
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

export default function Header({ setUser }) {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/">
						<MyHeader setUser={setUser} />
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

function MyHeader({ setUser }) {

	const user = useContext(UserContext);
	const [anchorEl, setAnchorEl] = useState(null);


	const logout = () => {
		setUser(null)
		window.localStorage.removeItem('token');
	}


	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<header className="app-header" style={styles.header}>
			<AppBar position="static" >
				<Toolbar style={styles.toolbar}>
					<Typography variant="subtitle1">
						AppChat
    				</Typography>

					<div>
						<Button color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
							<Avatar alt="Remy Sharp" src="../images/pic1.jpg"/>
							{user.name}							
						</Button>
						<Menu
							id="simple-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<Link to="/invite">
								{user.lang === 'EN' && (
									<MenuItem onClick={handleClose}>Invite a member</MenuItem>
								)}

								{user.lang === 'FR' && (
									<MenuItem onClick={handleClose}>Inviter un membre</MenuItem>
								)}
							</Link>

							<Link to="/change">
								{user.lang === 'EN' && (
									<MenuItem onClick={handleClose}>Change your informations</MenuItem>
								)}

								{user.lang === 'FR' && (
									<MenuItem onClick={handleClose}>Changer tes informations</MenuItem>
								)}
							</Link>
						</Menu>
						{user.lang === 'EN' && (
							<Button color="inherit" onClick={logout}>
								<PowerOffIcon />
								Logout
							</Button>
						)}

						{user.lang === 'FR' && (
							<Button color="inherit" onClick={logout}>
								<PowerOffIcon />
								Déconnexion
							</Button>
						)}
					</div>
				</Toolbar>
			</AppBar>
		</header>
	);
}

function Invite() {
	const user = useContext(UserContext);

	const [channels, setChannels] = useState([]);
	const [selectedChannel, setSelectedChannel] = useState([]);
	const [channelMember, setChannelMember] = useState('');
	const [channelMemberId, setChannelMemberId] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/channels', {
		}).then(response => {
			setChannels(response.data);
		})
	}, []);

	const addMember = () => {
		//On va chercher le userId avec son email		
		axios.get('http://localhost:8000/api/v1/users/' + channelMember).then(response => {
			setChannelMemberId(response.data.id);
		})
			.catch(err => {
			})

		axios.put('http://localhost:8000/api/v1/channels/' + selectedChannel.id, {
			name: selectedChannel.name,
			member: channelMemberId
		}).then(response => {
			setMessage(response.data)
			setChannelMember('')
		})
			.catch(err => {
			})
	};

	return (
		<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
			{user.lang === 'EN' && (
				<InputLabel id="demo-controlled-open-select-label">Choose your channel</InputLabel>
			)}

			{user.lang === 'FR' && (
				<InputLabel id="demo-controlled-open-select-label">Choisis ton channel</InputLabel>
			)}

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
			{user.lang === 'EN' && (
				<div>
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

					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', margin: 5 } : { backgroundColor: '#663399', margin: 5 }}
						onClick={addMember}
					>
						Add a member
					</Button>

					{message}
				</div>
			)}

			{user.lang === 'FR' && (
				<div>
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

					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', margin: 5 } : { backgroundColor: '#663399', margin: 5 }}
						onClick={addMember}
					>
						Ajouter un membre
					</Button>

					{message}
				</div>
			)}
			<Link to="/">
				{user.lang === 'EN' && (
					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
					>
						Quit
					</Button>
				)}

				{user.lang === 'FR' && (
					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
					>
						Quitter
					</Button>
				)}
			</Link>
		</div>
	);
}

function ChangeUserInfo({ setUser }) {
	const user = useContext(UserContext);

	const [userName, setUserName] = useState('');
	const [userPassword, setUserPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleChangeMode = () => {
		if (user.isDay == true) {
			setUser({
				...user,
				isDay: false
			})
		}
		else {
			setUser({
				...user,
				isDay: true
			})
		}
	};

	const handleChangeLang = () => {
		if (user.lang == 'EN') {
			setUser({
				...user,
				lang: 'FR'
			})
		}
		else {
			setUser({
				...user,
				lang: 'EN'
			})
		}
	};

	const validateChange = () => {
		axios.put('http://localhost:8000/api/v1/users/' + user.id, {
			name: user.name,
			password: user.password,
			isDay: user.isDay,
			lang: user.lang,
		}).catch((error) => setMessage(
			error.response.data.message
		));
	};

	const changeUser = () => {
		axios.put('http://localhost:8000/api/v1/users/' + user.id, {
			name: userName,
			password: userPassword,
		}).then(response => {
			setMessage(response.data.message);
		})
			.catch((error) => setMessage(error.response.data.message));
	}

	return (
		<div style={{ display: 'flex', justifyContent: 'space-between' }}>
			{user.lang === 'EN' && (
				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<TextField
						style={{ width: 375, margin: 5 }}
						label="New name"
						variant="outlined"
						size="small"
						type="text"
						onChange={(e) => { setUserName(e.target.value) }}
						name="channelMember"
						value={userName}
					/>

					<TextField
						style={{ width: 375, margin: 5 }}
						label="New password"
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
						Change
					</Button>

					<Link to="/">
						<Button
							variant="contained"
							color="primary"
							style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
						>
							Quit
						</Button>
					</Link>
					<p>{message}</p>
				</div>
			)}

			{user.lang === 'FR' && (
				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<TextField
						style={{ width: 375, margin: 5 }}
						label="Nouveau nom"
						variant="outlined"
						size="small"
						type="text"
						onChange={(e) => { setUserName(e.target.value) }}
						name="channelMember"
						value={userName}
					/>

					<TextField
						style={{ width: 375, margin: 5 }}
						label="Nouveau mot de passe"
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
						Changer
					</Button>

					<Link to="/">
						<Button
							variant="contained"
							color="primary"
							style={user.isDay ? { backgroundColor: '#6495ED', width: 375, margin: 5 } : { backgroundColor: '#663399', width: 375, margin: 5 }}
						>
							Quitter
						</Button>
					</Link>
					<p>{message}</p>
				</div>
			)}

			{user.lang === 'EN' && (
				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<div style={styles.switch}>
						<p>Light Mode</p>
						<SwitchCompo
							onChange={handleChangeMode}
							name="isDay"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>Dark Mode</p>
					</div>
					<div style={styles.switch}>
						<p>English</p>
						<SwitchCompo
							onChange={handleChangeLang}
							name="language"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>French</p>
					</div>
					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', width: 230 } : { backgroundColor: '#663399', width: 230 }}
						onClick={validateChange}
					>
						Validate
					</Button>
				</div>
			)}

			{user.lang === 'FR' && (
				<div style={user.isDay ? styles.inviteDay : styles.inviteNight}>
					<div style={styles.switch}>
						<p>Mode clair</p>
						<SwitchCompo
							onChange={handleChangeMode}
							name="isDay"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>Mode sombre</p>
					</div>
					<div style={styles.switch}>
						<p>Anglais</p>
						<SwitchCompo
							onChange={handleChangeLang}
							name="language"
							inputProps={{ 'aria-label': 'secondary checkbox' }}
						/>
						<p>Français</p>
					</div>
					<Button
						variant="contained"
						color="primary"
						style={user.isDay ? { backgroundColor: '#6495ED', width: 230 } : { backgroundColor: '#663399', width: 230 }}
						onClick={validateChange}
					>
						Valider
					</Button>
				</div>
			)}
		</div>
	);
};



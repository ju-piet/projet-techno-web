import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, TextField } from '@material-ui/core'
import PowerOffIcon from '@material-ui/icons/PowerOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SwitchCompo from '@material-ui/core/Switch';
import {UserContext} from '../Contexts'
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
	headerLog: {
		backgroundColor: '#373B44',
		height: '10',
	},
	buttonSignIn: {
		color: 'white',
		backgroundColor: '#373B44',
	},
	buttonSignUp: {
		color: 'black',
	},
	invite: {
		display: 'flex',
		flexDirection: 'column',
		borderBottom: '2px solid black',
		backgroundColor: '#87CEFA',
		color:'black',
		padding:10,
	},
	input: {
		margin:5,
		color:'white'
	},
	switch: {
		display: 'flex'
	},
};

export default function Header({setUser}) {
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
				  <ChangeUserInfo />
              </Route>
			  <Route path="/preferences">
				  <UserPreferences />
              </Route>
            </Switch>
          </div>
        </Router>
      );
}

function MyHeader({ setUser }){
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
					<Typography variant="h6">
						AppChat
    				</Typography>

					<div>
						<Button color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
							<AccountCircleIcon />{user.name}
						</Button>
						<Menu
							id="simple-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
						<Link to="/invite">
							<MenuItem onClick={handleClose}>Invite a member</MenuItem>
						</Link>
						<Link to="/change">
							<MenuItem onClick={handleClose}>Change your informations</MenuItem>
						</Link>
						<Link to="/preferences">
							<MenuItem onClick={handleClose}>Account preferences</MenuItem>
						</Link>
						</Menu>
						<Button color="inherit" onClick={logout}>
							<PowerOffIcon />
							Logout
						</Button>
					</div>

				</Toolbar>
			</AppBar>
		</header>
	);
}

function Invite() {
	const [channels, setChannels] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/channels', {
		}).then(response => {
			setChannels(response.data);
		})
	}, []);


	return (
		<div style={styles.invite}>
			<Autocomplete 
				id="combo-box-demo"
				size="small"
				options={channels.name}
				getOptionLabel={(option) => option.title}
				style={{ width: 375, margin:5 }}
				renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
			/>

			<div>
				<TextField
					label="Member email"
					variant="outlined"
					size="small"
					type="text"
					//onChange={(e) => {setChannelMember(e.target.value)}}
					name="channelMember"
					style={styles.input}
				//value={channelMember}
				/>
				<Button 
					variant="contained" 
					color="primary" 
					style={{margin:5}}
					//onClick={addMember}
				>
					Add a member
				</Button>
			</div>
			<Link to="/">
				<Button 
					variant="contained" 
					color="primary" 
					style={{ width: 375, margin:5 }}
				>
					Quit
				</Button>			
			</Link>
		</div>
	);
}

function ChangeUserInfo() {
	const user = useContext(UserContext);

	const [userName, setUserName] = useState('');
	const [userPassword, setUserPassword] = useState('');
	const [message, setMessage] = useState('');

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
		<div style={styles.invite}>
			<TextField
				style={{ width: 375, margin: 5 }}
				label="Member name"
				variant="outlined"
				size="small"
				type="text"
				onChange={(e) => { setUserName(e.target.value) }}
				name="channelMember"
				value={userName}
			/>
			<TextField
				style={{ width: 375, margin: 5 }}
				label="Member password"
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
				style={{ width: 375, margin: 5 }}
				onClick={changeUser}
			>
				Change
				</Button>

			<Link to="/">
				<Button
					variant="contained"
					color="primary"
					style={{ width: 375, margin: 5 }}
				>
					Quit
				</Button>
			</Link>
			<p>{message}</p>
		</div>
	);
};

function UserPreferences() {

	const [theme, setTheme] = useState({
		isDay: true
	});

	const handleChangeMode = (event) => {
		setTheme({ ...theme, [event.target.name]: event.target.checked });
	};

	const [lang, setLanguage] = useState({
		language: 'EN'
	});

	const handleChangeLang = (event) => {
		setLanguage({ ...lang, [event.target.name]: event.target.checked });
	};


	return (
		<div style={styles.invite}>
			<div style={styles.switch}>
				<p>Dark Mode</p>
				<SwitchCompo
					checked={theme.isDay}
					onChange={handleChangeMode}
					name="isDay"
					inputProps={{ 'aria-label': 'secondary checkbox' }}
				/>
				<p>Light Mode</p>
			</div>
			<div style={styles.switch}>
				<p>French</p>
				<SwitchCompo
					checked={lang.language}
					onChange={handleChangeLang}
					name="language"
					inputProps={{ 'aria-label': 'secondary checkbox' }}
				/>
				<p>English</p>
			</div>
			<Link to="/">
				<Button
					variant="contained"
					color="primary"
					style={{ width: 220, margin: 5 }}
				>
					Quit
			</Button>
			</Link>
		</div>
	);
};


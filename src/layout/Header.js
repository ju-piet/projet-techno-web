import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import PowerOffIcon from '@material-ui/icons/PowerOff';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {UserContext} from '../Contexts'

const styles = {
	toolbar:{
		textAlign: 'center',
		display:'flex',
		justifyContent:'space-between',
	},
	header: {
		backgroundColor: 'rgba(255,255,255,.3)',
		textAlign: 'center',
		flexShrink: 0
	},
	headerLog: {
		backgroundColor: '#373B44',
		height:'10',
	},
	buttonSignIn: {
		color: 'white',
		backgroundColor: '#373B44',
	},
	buttonSignUp: {
		color: 'black',
	},
};

const Header = ({setUser, setToken}) => {

	const user = useContext(UserContext);

	const logout = () => {
		setUser(null)
		setToken('')
	}

	return (
		<header className="app-header" style={styles.header}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">
						AppChat
    			</Typography>

					<Button color="inherit">
						<AccountCircleIcon />{user.name}
					</Button>
					<Button color="inherit" onClick={logout}>
						<PowerOffIcon /> Logout
				</Button>
				</Toolbar>
			</AppBar>
		</header>
	);
}


export default Header;

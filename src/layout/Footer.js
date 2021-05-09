import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography} from '@material-ui/core'
import { UserContext } from '../Contexts'

const styles = {
	footer: {
		backgroundColor: 'rgba(255,255,255,.3)',
		textAlign: 'center',
		height: 'auto',
		flexShrink: 0,
		borderTop: '2px solid black',
	},
};

const texts = {
	"FR": {
		"footer": "Application faite par PIET Julien et NAMANE Mohammed",
	},

	"EN": {
		"footer": "Application made by PIET Julien and NAMANE Mohammed",
	},
}

export default function Footer () {
	// On initialise notre context user
	const user = useContext(UserContext);

	// On affiche notre footer
	return(
		<footer className="app-footer" style={styles.footer}>		
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">
						{texts[user.lang]["footer"]}
    				</Typography>
				</Toolbar>
			</AppBar>
		</footer>
	)
}


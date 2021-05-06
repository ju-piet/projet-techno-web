import React from 'react';
import { AppBar, Toolbar, Typography} from '@material-ui/core'

const styles = {
	footer: {
		backgroundColor: 'rgba(255,255,255,.3)',
		textAlign: 'center',
		height: 'auto',
		flexShrink: 0,
		borderTop: '2px solid black',
	},
};

const Footer = () => (
	<footer className="app-footer" style={styles.footer}>
		
		<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">
						Application made by PIET Julien et NAMANE Mohammed
    				</Typography>
				</Toolbar>
			</AppBar>
	</footer>
);

export default Footer;

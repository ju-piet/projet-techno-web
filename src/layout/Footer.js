import React from 'react';

const styles = {
	footer: {
		backgroundColor: 'rgba(255,255,255,.3)',
		textAlign: 'center',
		height: 'auto',
		flexShrink: 0
	},
};

const Footer = () => (
	<footer className="app-footer" style={styles.footer}>
		<h1>Projet réalisé par PIET Julien et NAMANE Mohammed</h1>
	</footer>
);

export default Footer;

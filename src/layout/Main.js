import React, {useContext, useState} from 'react';
import Channel from '../channel/Channel';
import Channels from '../channel/Channels';
import { UserContext } from '../Contexts';

const styles = {
	mainDay: {
		backgroundColor: '#FAFAD2',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden',
		borderLeft:'2px solid black',
		borderRight:'2px solid black'
	},
	mainNight: {
		backgroundColor: '#191970',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden',
		borderLeft:'2px solid black',
		borderRight:'2px solid black'
	},
};

// Main 
const Main = () => {
	// On initialise notre context
	const user = useContext(UserContext)

	/* On initialise nos states */
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [error, setError] = useState(false);

	// On affiche le main
	return (
		<main className='app-main' style={user.isDay ? styles.mainDay : styles.mainNight}>
			<Channels handleClick={setSelectedChannel} setError={setError} />
			<Channel channel={selectedChannel} error={error}/>
		</main>
	);
};

export default Main;

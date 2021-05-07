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

const Main = () => {
	const [selectedChannel, setSelectedChannel] = useState({
		name: 'Fake channel',
		id: 'fake_id',
	});

	const user = useContext(UserContext)

	return (
		<main className='app-main' style={user.isDay ? styles.mainDay : styles.mainNight}>
			<Channels handleClick={setSelectedChannel} />
			<Channel channel={selectedChannel} />
		</main>
	);
};

export default Main;

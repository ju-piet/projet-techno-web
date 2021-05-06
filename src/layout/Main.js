import React, {useState} from 'react';
import Channel from '../channel/Channel';
import Channels from '../channel/Channels';

const styles = {
	main: {
		backgroundColor: '#FAFAD2',
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

	return (
		<main className='app-main' style={styles.main}>
			<Channels handleClick={setSelectedChannel} />
			<Channel channel={selectedChannel} />
		</main>
	);
};

export default Main;

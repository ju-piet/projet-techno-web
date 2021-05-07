import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { UserContext } from '../Contexts';

const styles = {
    pageDay:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor: '#FAFAD2',
    },
    pageNight:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        backgroundColor: '#4169E1',
    },
	welcome: {
        fontSize:'xx-large',
	},
    buttonDay:{
        width:'20%',
        backgroundColor: '#6495ED'
    },
    buttonNight:{
        width:'20%',
        backgroundColor: '#663399'
    }
};

const Welcome = ({ setContinued, user }) => {
    const autoriseContinued = () => {
        setContinued(true);
    }

    return (
        <div >
            {user.lang === 'EN' && (
                <div style={user.isDay ? styles.pageDay : styles.pageNight}>
                    <p style={styles.welcome}>
                        Welcome to the chat !
                    </p>

                    <Button
                        style={user.isDay ? styles.buttonDay : styles.buttonNight}
                        variant="contained"
                        color="primary"
                        onClick={autoriseContinued}
                    >
                    Carry on !
                    </Button>

                    <p>
                        Please, to continue click on the button !
                    </p>
                </div>
            )}

            {user.lang === 'FR' && (
                <div style={user.isDay ? styles.pageDay : styles.pageNight}>
                    <p style={styles.welcome}>
                        Bienvenue dans le chat !
                    </p>

                    <Button
                        style={user.isDay ? styles.buttonDay : styles.buttonNight}
                        variant="contained"
                        color="primary"
                        onClick={autoriseContinued}
                    >
                    Continuez !
                    </Button>

                    <p>
                        S'il vous plait, pour continuer cliquez sur le bouton !
                    </p>
                </div>
            )}
        </div>
    );
}



export default Welcome;

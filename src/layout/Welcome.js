import React from 'react';
import { Button } from '@material-ui/core';

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

const texts = {
	"FR": {
		"title": "Bienvenue dans le chat !",
        "continue":"Continuez!",
        "please":"Sil vous plait, pour continuer cliquez sur le bouton !"
	},

	"EN": {
		"title": "Welcome to the chat!",
        "continue":"Carry on!",
        "please":"Please, to continue click on the button !"
	},
}

// Lorsqu'on se login, on arrive sur la page welcome
const Welcome = ({ setContinued, user }) => {

    // Lorsqu'on clique sur le bouton continuez...
    const autoriseContinued = () => {
        //... on renvoie le state continued en true 
        setContinued(true);
    }

    // On affiche la page welcome
    return (
        <div style={user.isDay ? styles.pageDay : styles.pageNight}>
            <p style={styles.welcome}>
                {texts[user.lang]["title"]}
            </p>

            <Button
                style={user.isDay ? styles.buttonDay : styles.buttonNight}
                variant="contained"
                color="primary"
                onClick={autoriseContinued}
            >
                {texts[user.lang]["continue"]}
            </Button>

            <p>
                {texts[user.lang]["please"]}
            </p>
        </div>
    );
}



export default Welcome;

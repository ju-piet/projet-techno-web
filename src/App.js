import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './layout/Header';
import Main from './layout/Main';
import Footer from './layout/Footer';
import Auth from './layout/Auth';
import Welcome from './layout/Welcome';
import {MessageContextProvider, TokenContext, UserContext} from './Contexts'
import axios from 'axios';

const styles = {
    root: {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F0F8FF',
        padding: 50
    },
    content: {
        flex: '1 1 auto',
        marginRight: '.5rem'
    },
};

// App
export default function App() {
    /* On set nos différents states */
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isContinued, setContinued] = useState(false);

    // On set le header avec notre token pour chaque changement de token
    useEffect(() => {
        if(token){
            axios.defaults.headers.common['authorization'] = "bearer " + token;
        }
    }, [token])

    // Si on n'est pas login on arrive sur la page d'authentification
    if (!token || !user) {
        return <Auth setToken={setToken} setUser={setUser} setContinued={setContinued} />
    }

    // Une fois login, on arrive sur la page de bienvenue
    if(isContinued === false){
        return (
            <Welcome setContinued={setContinued} user={user}/>
        );
    }

    // Une fois qu'on a cliqué sur le bouton, on arrive sur notre application
    if(isContinued === true){
        return (
            <div className="app" style={styles.root}>
                {/* On utilise le context pour donner accès à certaines données */}
                <MessageContextProvider>
                    <UserContext.Provider value={user}>
                        <TokenContext.Provider value={token}>
                            <Header setUser={setUser} setContinued={setContinued}/>
                            <Main />
                            <Footer />
                        </TokenContext.Provider>
                    </UserContext.Provider>
                </MessageContextProvider>
            </div>
        );
    }

}

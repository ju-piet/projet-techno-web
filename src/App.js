import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './layout/Header';
import Main from './layout/Main';
import Footer from './layout/Footer';
import Auth from './layout/Auth';
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

export default function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {

        if(token){
            axios.defaults.headers.common['authorization'] = "bearer " + token;
        }

    }, [token])


    if (!token || !user) {
        return <Auth setToken={setToken} setUser={setUser} />
    }

    return (
        <div className="app" style={styles.root}>
            <MessageContextProvider>
                <UserContext.Provider value={user}>
                    <TokenContext.Provider value={token}>
                        <Header setUser={setUser} />
                        <Main />
                        <Footer />
                    </TokenContext.Provider>
                </UserContext.Provider>
            </MessageContextProvider>
        </div>);
}

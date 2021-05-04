import React, { useState } from 'react';
import './App.css';
import Header from './layout/Header';
import Main from './layout/Main';
import Footer from './layout/Footer';
import Auth from './layout/Auth';
import {UserContext} from './Contexts'

const styles = {
    root: {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#565E71',
        padding: 50
    },
    content: {
        flex: '1 1 auto',
        marginRight: '.5rem'
    },
};

export default function App() {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);

    if (!token || !user) {
        return <Auth setToken={setToken} setUser={setUser} />
    }

    return (
        <div className="app" style={styles.root}>
            <UserContext.Provider value={user}>
                <Header />
                <Main />
                <Footer />
            </UserContext.Provider>
        </div>);
}

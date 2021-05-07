import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './layout/Header';
import Main from './layout/Main';
import Footer from './layout/Footer';
import Auth from './layout/Auth';
import {MessageContextProvider, TokenContext, UserContext} from './Contexts'
import axios from 'axios';
import Welcome from './layout/Welcome';
import Gravatar from 'react-awesome-gravatar';
import { GravatarOptions } from 'react-awesome-gravatar';


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
    const [isContinued, setContinued] = useState(false);

    const options = {
        size: 50,
        default:"./images/pic1.jpg",
    };

    useEffect(() => {

        if(token){
            axios.defaults.headers.common['authorization'] = "bearer " + token;
        }

    }, [token])
    console.log('yo', user, isContinued)

    if (!token || !user) {
        return <Auth setToken={setToken} setUser={setUser} setContinued={setContinued} />
    }

    if(isContinued==false){
        return (
            <Welcome setContinued={setContinued} user={user}/>
        );
    }

    if(isContinued==true){
        return (
            <div className="app" style={styles.root}>
                <MessageContextProvider>
                    <UserContext.Provider value={user}>
                        <TokenContext.Provider value={token}>
                            <Header setUser={setUser} setContinued={setContinued}/>
                            <Main />
                            <Footer />
                        </TokenContext.Provider>
                    </UserContext.Provider>
                </MessageContextProvider>
            </div>);
    }

}

import React, { useState, useContext } from "react";
import { Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckIcon from '@material-ui/icons/Check';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const styles = {
    header: {
        backgroundColor: '#373B44',
        textAlign: 'center',
        flexShrink: 0
    },
    form: {
        backgroundColor: 'rgba(255,255,255,.3)',
        textAlign: 'center',
        padding: '20px',
        flexShrink: 0
    },
    input: {
        marginBottom: '10px'
    },
    buttonSignIn: {
        color: 'white',
        backgroundColor: '#373B44',
    },
    buttonSignUp: {
        color: 'black',
    },
};

export default function Auth({setToken, setUser}) {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/">
                <Login setToken={setToken} setUser={setUser} />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
            </Switch>
          </div>
        </Router>
      );
}

function Login({setToken, setUser}){
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();
    const [LoginError, setLoginError] = useState(false);

    const onSubmit = e => {
        axios.post('http://localhost:8000/api/v1/users/login', {
            email: userEmail,
            password: userPassword
        })
        .then(response => {
            setToken(
                response.data.access_token,
            );
            setUser(
                response.data.user,
            );
        })
        .catch(err => {
            if (err.status == 404) {
                setLoginError(true);
            }
        })
    }

    return (
        <div>
            
            <header style={styles.header}>
                <h1>Welcome !</h1>
            </header>

            <form style={styles.form}>
                <div>
                    <label for="email">Email :</label><br />
                    <input
                        onChange={e => setUserEmail(e.target.value)}
                        type="text"
                        id="email"
                        name="user_email"
                        style={styles.input} />
                </div>

                <div>
                    <label for="password">Password :</label><br />
                    <input
                        onChange={e => setUserPassword(e.target.value)}
                        type="password"
                        id="password"
                        name="user_password"
                        style={styles.input} />
                </div>

                <div>
                    <Button variant="contained" style={styles.buttonSignIn} onClick={onSubmit}>
                        <AccountCircleIcon /> Sign In
                    </Button>
                    <p><Link to="/register">If I don't have an account, please register !</Link></p>
                </div>

                {LoginError && (<p>Email ou mot de passe incorrecte</p>)}
            </form>
        </div>
    );
}

function Register() {
    const [newUserName, setnewUserName] = useState('');
    const [newUserEmail, setnewUserEmail] = useState('');
    const [newUserPassword, setnewUserPassword] = useState('');
    const [message, setMessage] = useState('');
    const [registerError, setRegisterError] = useState(false);

    const onSubmit = e => {
        axios.post('http://localhost:8000/api/v1/users', {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword
        })
        .then(response => {
            setMessage(response.data)
            setnewUserName('')
            setnewUserEmail('')
            setnewUserPassword('')
        })
        .catch(err => {
            if (err.status == 404) {
                setRegisterError(true);
            }
        })
    }

    return (
        <div>
            <header style={styles.header}>
                <h1>Registration</h1>
            </header>

            <form style={styles.form}>
                <div>
                    <label for="new-name">Your name :</label><br />
                    <input 
                        onChange={e => setnewUserName(e.target.value)}
                        type="text" 
                        id="new-name" 
                        name="new-user_name" 
                        style={styles.input}
                        value={newUserName} />
                </div>

                <div>
                    <label for="email">Your email :</label><br />
                    <input 
                        onChange={e => setnewUserEmail(e.target.value)}
                        type="text" 
                        id="new-email" 
                        name="new-user_email" 
                        style={styles.input}
                        value={newUserEmail} />
                </div>

                <div>
                    <label for="password">Your password :</label><br />
                    <input 
                        onChange={e => setnewUserPassword(e.target.value)}
                        type="password" 
                        id="new-password" 
                        name="new-user_password" 
                        style={styles.input}
                        value={newUserPassword} />
                </div>

                <div>
                    <Button variant="contained" style={styles.buttonSignIn} onClick={onSubmit}>
                        <CheckIcon />
                        Validate
                    </Button>

                    <Link to="/">
                        <Button variant="contained" style={styles.buttonSignIn}>
                            <ArrowBackIosIcon/>
                            Back
                        </Button>
                    </Link>
                </div>

                <div>
                    <p>{message}</p>
                </div>
            </form>
        </div>
    );
}
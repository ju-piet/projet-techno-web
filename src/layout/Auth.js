import React, { useState } from "react";
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
        backgroundColor: '#3f51b5',
        textAlign: 'center',
        height:'50px',
        flexShrink: 0
    },
    form: {
        backgroundColor: '#FAFAD2',
        textAlign: 'center',
        padding: '20px',
        flexShrink: 0,
    },
    input: {
        marginBottom: '10px'
    },
    buttonSignIn: {
        color: 'black',
        backgroundColor: '#6495ED',
        margin:5
    },
};

export default function Auth({setUser, setToken, setContinued}) {
    /* Création de notre router, switch et routes */
    return (
        <Router>
            <Switch>
              <Route exact path="/">
                <Login setUser={setUser} setToken={setToken} setContinued={setContinued} />
              </Route>
              
              <Route path="/register">
                <Register />
              </Route>
            </Switch>
        </Router>
      );
}

// Page de login
function Login({setUser, setToken, setContinued}){
    /* On initialise nos states user */
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();

    // On initialise notre erreur de login
    const [loginError, setLoginError] = useState(false);

    // Lorsqu'on clique sur le bouton login...
    const onSubmitLogin = () => {
        // On poste notre login dans la base afin de vérifier si l'utilisateur existe...
        axios.post('http://localhost:8000/api/v1/users/login', {
            email: userEmail,
            password: userPassword
        })
        //... s'il existe...
        .then(response => {
            //... on set notre token
            setToken(response.data.access_token)
            //... on set notre user
            setUser(
                response.data.user,
            );
            //... on set notre bool pour la page welcome
            setContinued(false)
            //... on set l'erreur de login à true
            setLoginError(false);
        })
        //... s'il n'existe pas...
        .catch(err => {
            if (err.status === 404) {
                //... on set l'erreur de login à true
                setLoginError(true);
            }
        })
    }

    // On affiche notre page de login
    return (
        <div>    
            <header style={styles.header}>
                <h1 style={{ color:'white', padding:5 }}>Please log in !</h1>
            </header>

            <form style={styles.form}>
                <div>
                    <label htmlFor="email">Email :</label><br />
                    <input
                        onChange={e => setUserEmail(e.target.value)}
                        type="text"
                        id="email"
                        name="user_email"
                        style={styles.input} />
                </div>

                <div>
                    <label htmlFor="password">Password :</label><br />
                    <input
                        onChange={e => setUserPassword(e.target.value)}
                        type="password"
                        id="password"
                        name="user_password"
                        style={styles.input} />
                </div>

                <div>
                    <Button variant="contained" style={styles.buttonSignIn} onClick={onSubmitLogin}>
                        <AccountCircleIcon /> Sign In
                    </Button>
                    <p><Link to="/register">If I don't have an account, please register !</Link></p>
                </div>

                {loginError && (<p>Incorrect email and/or password</p>)}
            </form>
        </div>
    );
}

// Page de register
function Register() {
    /* On initialise nos states user */
    const [newUserName, setnewUserName] = useState('');
    const [newUserEmail, setnewUserEmail] = useState('');
    const [newUserPassword, setnewUserPassword] = useState('');
   
    // On initialise notre erreur de register
    const [registerError, setRegisterError] = useState(false);

    // On initialise notre state message
    const [message, setMessage] = useState('');

    const onSubmitRegister = () => {
        // On poste notre user en base 
        axios.post('http://localhost:8000/api/v1/users', {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            isDay:true,
            lang:'EN'
        })
        .then(response => {
            /* On set nos states */
            setMessage(response.data)
            setnewUserName('')
            setnewUserEmail('')
            setnewUserPassword('')
            setRegisterError(false)
        })
        .catch(err => {
            if (err.status === 404) {
                //... on set l'erreur de register à true
                setRegisterError(true)
                //... on set notre message
                setMessage('')
            }
        })
    }

    // On affiche notre page register
    return (
        <div>
            <header style={styles.header}>
                <h1 style={{ color:'white' }}>Registration</h1>
            </header>

            <form style={styles.form}>
                <div>
                    <label htmlFor="new-name">Your name :</label><br />
                    <input 
                        onChange={e => setnewUserName(e.target.value)}
                        type="text" 
                        id="new-name" 
                        name="new-user_name" 
                        style={styles.input}
                        value={newUserName} />
                </div>

                <div>
                    <label htmlFor="email">Your email :</label><br />
                    <input 
                        onChange={e => setnewUserEmail(e.target.value)}
                        type="text" 
                        id="new-email" 
                        name="new-user_email" 
                        style={styles.input}
                        value={newUserEmail} />
                </div>

                <div>
                    <label htmlFor="password">Your password :</label><br />
                    <input 
                        onChange={e => setnewUserPassword(e.target.value)}
                        type="password" 
                        id="new-password" 
                        name="new-user_password" 
                        style={styles.input}
                        value={newUserPassword} />
                </div>

                <div>
                    <Button variant="contained" style={styles.buttonSignIn} onClick={onSubmitRegister}>
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
                    <p>{message} {registerError && (<p>Incorrect name and/or email and/or password</p>)}</p>
                </div>
            </form>
        </div>
    );
}
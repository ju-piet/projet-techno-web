import React, { useContext, createContext, useState } from "react";
import { Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

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

export default function AuthExample() {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <AuthButton />

          <Switch>
            <Route path="/" exact>
              <LoginPage />
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <PrivateRoute path="/app">
              <App />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

const Auth = {
  isAuthenticated: false,
  signin(cb) {
    Auth.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout(cb) {
    Auth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = cb => {
    return Auth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return Auth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

function LoginPage() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/app" } };
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <header style={styles.header}>
        <h1>Welcome !</h1>
      </header>

      <form style={styles.form}>
        <div>
          <label for="email">Email :</label><br />
          <input 
          type="text" 
          id="email" 
          name="user_email" 
          style={styles.input} />
        </div>

        <div>
          <label for="password">Password :</label><br />
          <input 
            type="password" 
            id="password" 
            name="user_password" 
            style={styles.input} />
        </div>

        <div>
          <Link to="/">
            <Button variant="contained" style={styles.buttonSignIn} onClick={login}>
              <AccountCircleIcon /> Sign In
            </Button>
          </Link>

          <Link to="/register">You don't have an account, register!</Link>
        </div>
      </form>
    </div>
  );
}

function Register() {
  return (
    <div>
      <header style={styles.header}>
        <h1>Registration</h1>
      </header>

      <form style={styles.form}>
        <div>
          <label for="new-name">Your name :</label><br />
          <input type="text" id="new-name" name="new-user_name" style={styles.input} />
        </div>

        <div>
          <label for="email">Your email :</label><br />
          <input type="text" id="new-email" name="new-user_email" style={styles.input} />
        </div>

        <div>
          <label for="password">Your password :</label><br />
          <input type="password" id="new-password" name="new-user_password" style={styles.input} />
        </div>

        <div>
          <Button variant="contained" style={styles.buttonSignIn}>
            <AccountCircleIcon />
                    Validate
                </Button>

          <Link to="/">
            <Button variant="contained" style={styles.buttonSignIn}>
              Back
                    </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
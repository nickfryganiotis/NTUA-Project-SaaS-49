import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from './SignIn'
import SignUp from './SignUp';
import './App.css';

function App() {
  return (
    <>
      <container maxWidth="md">
        <div className="app">
            <Switch>
            <Route path="/" exact component = {SignIn} />
            <Route path="/sign_up" exact component = {SignUp} />
            </Switch>
        </div>
      </container>
    </>
  );
}

export default App;

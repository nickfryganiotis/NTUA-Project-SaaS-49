import React from "react";
import { Route, Switch } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import AskForm from "./AskForm";
import AnswerForm from "./AnswerForm";
import "./App.css";
import Homepage from "./Homepage";
import Profile from "./Profile";
import Error from "./Error";

function App() {
  return (
        <div className="app">
          <div className="ama-header">
            Ask Me Anything
          </div>
          <Switch>
            <Route path="/sign_in" exact component={SignIn} />
            <Route path="/sign_up" exact component={SignUp} />
            <Route path="/ask" exact component={AskForm} />
            <Route path="/answer" exact component={AnswerForm} />
            <Route path="/" exact component={Homepage} />
            <Route path="/profile" exact component={Profile} />
            <Route path="*" exact component={Error} />
          </Switch>
        </div>
  );
}

export default App;

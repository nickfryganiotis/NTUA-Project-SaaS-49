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
import Navbar from "./Navbar";
import { NavProvider } from "./context/NavContext";

function App() {
  return (
    <div className="app">
      <NavProvider>
        <Navbar />
        <Switch>
          <Route path="/sign_in" exact component={SignIn} />
          <Route path="/sign_up" exact component={SignUp} />
          <Route path="/ask" exact component={AskForm} />
          <Route path="/answer" exact component={AnswerForm} />
          <Route path="/" exact component={Homepage} />
          <Route path="/profile" exact component={Profile} />
          <Route path="*" exact component={Error} />
        </Switch>
      </NavProvider>
    </div>
  );
}

export default App;

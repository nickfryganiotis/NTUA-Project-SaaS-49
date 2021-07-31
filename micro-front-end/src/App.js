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
import "./styling/login.css";
import "./styling/signup.css"
import "./styling/homepage.css"
import "./styling/graphs.css"
import "./styling/question.css"
import "./styling/answer.css"
import "./styling/qna.css"
import QuestionsPerKeyword from "./QuestionsPerKeyword";
import QuestionsPerDay from "./QuestionsPerDay";
import MyQna from "./MyQna";
import MyContributions from "./MyContributions";

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
          <Route path="/questions-per-keyword" exact component={QuestionsPerKeyword}/>
          <Route path="/questions-per-day" exact component={QuestionsPerDay}/>
          <Route path="/my-contributions" exact component={MyContributions}/>
          <Route path="/my-qna" exact component={MyQna}/>
          <Route path="*" exact component={Error} />
        </Switch>
      </NavProvider>
    </div>
  );
}

export default App;

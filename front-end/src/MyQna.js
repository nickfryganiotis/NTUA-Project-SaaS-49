import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function MyQna() {
  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);
  let history= useHistory();
  function timeConverter(UNIX_timestamp, showfull = true) {
    if (UNIX_timestamp) {
      let x = Date.parse(UNIX_timestamp);
      let a = new Date(x);
      let year = a.getFullYear();
      let month = a.getMonth() + 1;
      let date = a.getDate();
      let hour =
        Math.floor(a.getHours() / 10) === 0
          ? "0" + a.getHours().toString()
          : a.getHours();
      let min =
        Math.floor(a.getMinutes() / 10) === 0
          ? "0" + a.getMinutes().toString()
          : a.getMinutes();
      let time = date + "/" + month + "/" + year + " " + hour + ":" + min;
      let tim2 = date + "/" + month + "/" + year;
      return showfull ? time : tim2;
    }
    return null;
  }

  useEffect(() => {
    if (localStorage.getItem("ask-me-anything-token") === null) {
      history.replace("/sign_in");
    }
    else{
    let t = JSON.parse(localStorage.getItem("ask-me-anything-token"));
    let api_options = [
      axios({
        method: "post",
        url: "http://localhost:5001/my_questions",
        data: t,
      }),
      axios({
        method: "post",
        url: "http://localhost:5001/my_answers",
        data: t,
      }),
    ];

    axios.all(api_options).then(
      axios.spread((obj1, obj2) => {
        setMyQuestions(obj1.data);
        setMyAnswers(obj2.data);
      })
    );
    }
  }, []);

  return (
    <div className="qna-wrapper">
      <div>
        <p className="qna-header">My Questions</p>
        <div className="q-container">
          {myQuestions.length !== 0 &&
            myQuestions.map((question) => (
              <fieldset>
                <p>
                  On {timeConverter(question["date_asked"], true)} you asked:
                </p>
                <blockquote>{question["question_title"]}</blockquote>
              </fieldset>
            ))}
        </div>
      </div>
      <div>
        <p className="qna-header">My Answers</p>
        <div className="q-container">
          {myAnswers.length !== 0 &&
            myAnswers.map((answer) => (
              <fieldset>
                <p>
                  On {timeConverter(answer["date_posted"], true)} you answered
                  the question: <b>"{answer["question_title"]}"</b>:
                </p>
                <blockquote>{answer["answer_text"]}</blockquote>
              </fieldset>
            ))}
        </div>
      </div>
    </div>
  );
}

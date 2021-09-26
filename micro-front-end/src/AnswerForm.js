import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function AnswerForm() {
  const [answer, setAnswer] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [token, setToken] = useState({});
  const [questionData, setQuestionData] = useState([]);

  let hist = useHistory()

  useEffect(() => {
    if (localStorage.getItem("ask-me-anything-token") === null){hist.replace("/sign_in")}
    else{
    let t = JSON.parse(localStorage.getItem("ask-me-anything-token"));
    setToken(t);
    let question_options = {
      method: "post",
      url: "http://localhost:5005/get_question_titles",
      data: t,
    };
    axios(question_options)
      .then((res) => {setQuestions(res.data.question_titles); console.log(res.data)})
      .catch((error) => alert("Something went wrong..."));
  }
  }, []);

  useEffect(() => {
    if (selectedQuestion !== null) {
      let answer_options = {
        method: "post",
        url: "http://localhost:5006/question_info",
        data: { ...selectedQuestion, token: token["token"] },
      };
      axios(answer_options)
        .then((res) => {
          setQuestionData(res.data.question_text);
          console.log(res.data);
          setKeywords(res.data.keywords);
          setAnswers(res.data.answers);
          console.log(res.data);
        })
        .catch((error) => alert("Something went wrong..."));
      console.log(answer_options);
    }
  }, [selectedQuestion]);

  const handleQuestionChange = (e) => {
    const { value, name } = e.target;
    setAnswer({ ...answer, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let answering_options = {
      method: "post",
      url: "http://localhost:5007/answer_question",
      data: {
        ...answer,
        token: token.token,
        question_title: selectedQuestion["question_title"],
      },
    };
    axios(answering_options)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };

  const handleAnswerChange = (e) => {
    const { value, name } = e.target;
    setSelectedQuestion({ ...selectedQuestion, [name]: value });
  };

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

  return (
    <div>
      <p className="ask-header">Answer a Question</p>
      <div className="answer-wrapper">
        <div className="ask-div">
          <label htmlFor="question_title" className="answer-label">
            Select question
          </label>
          <select
            name="question_title"
            id="question_title"
            onChange={handleAnswerChange}
            className="login-input"
          >
            <option></option>
            {questions.length !== 0 &&
              questions.map((question) => (
                <option>{question["question_title"]}</option>
              ))}
          </select>
        </div>
        <div className="ask-div">
          {questionData.length !== 0 && (
            <fieldset style={{backgroundColor: "white"}}>
              "{questionData[0]["question_text"]}"
              <blockquote className="small-bq">
                Asked by {questionData[0]["username"]} on{" "}
                {timeConverter(questionData[0]["date_asked"], true)}
              </blockquote>
            </fieldset>
          )}
        </div>
        <div className="ask-div">
          <label htmlFor="keywords" className="answer-label">
            Keywords:
          </label>
          <input
            type="text"
            name="keywords"
            id="keywords"
            disabled
            placeholder={keywords
              .map((keyword) => keyword["keyword_title"])
              .join()}
            className="login-input"
          ></input>
        </div>
        <div className="ask-div">
          <label htmlFor="selected-answers" className="answer-label">
            Answers:
          </label>
          <div className="answers-container">
            {answers.length !== 0 &&
              answers.map((ans) => {
                return (
                  <fieldset>
                    "{ans["answer_text"]}"
                    <blockquote className="small-bq">{ans["username"]} {timeConverter(ans["date_posted"], true)}</blockquote>
                  </fieldset>
                );
              })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ask-div">
          <div>
            <label htmlFor="answer_text" className="answer-label">
              Your answer
            </label>
            <textarea
              name="answer_text"
              id="answer_text"
              onChange={handleQuestionChange}
              required
              className="answer-textarea"
            ></textarea>
          </div>
          <div className="ask-div-buttons">
          <button type="submit" className="ask-submit">Submit</button>
          <button onClick={() => hist.push("/")} className="ask-cancel">Cancel</button>
        </div>
        </form>
      </div>
    </div>
  );
}

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Creatable from "react-select/creatable";

export default function AskForm() {
  const [question, setQuestion] = useState({ oldKeywords: [] });
  const [keywordList, setKeywordList] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [token, setToken] = useState({});
  const hist = useHistory();
  useEffect(() => {
    if (localStorage.getItem("ask-me-anything-token") === null){hist.replace("/sign_in")}
    else{
    let t = JSON.parse(localStorage.getItem("ask-me-anything-token"))
    setToken(t);

    let keyword_options = {
      method:"post",
      url: "http://localhost:5003/get_keywords",
      data: t
    }
    axios(keyword_options)
      .then((res) => {
        let x = res.data["keywords"]
        if (x.length!==0){
          let y = x.map((element)=>{
            return({
              value: element["keyword_id"],
              label: element["keyword_title"]
            })
          })
          setKeywordList(y)
        }
      })
      .catch((error) => console.log(error));
    }
  }, []);

  const handleQuestionChange = (e) => {
    const { value, name } = e.target;
    setQuestion({ ...question, [name]: value });
  };

  const handleKeywordChange = (value) => {
    setSelectedKeywords(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newKeywordNames = []
    let oldKeywordIds = []
    selectedKeywords.forEach((keyword) => {
      if (keyword["__isNew__"]) {
        newKeywordNames.push(keyword["label"])
      } else {
        oldKeywordIds.push(keyword["value"])
        console.log(keyword)
      }
    });
    let z = {...question}
    z["newKeywords"] = newKeywordNames.length === 0 ? [] : [...newKeywordNames]
    z["oldKeywords"] = oldKeywordIds.length === 0 ? [] : [...oldKeywordIds]
    setQuestion(z)
    let ask_options = {
      method: "post",
      url: "http://localhost:5002/create_question",
      data: {...z, token : token["token"]},
    };
    console.log(z)
    axios(ask_options)
      .then((res) => {
        alert("Question successfully created, stay tuned for upcoming answers!")
        e.target.reset()
      })
      .catch((error) => alert("Something went wrong..."));
  };

  return (
    <div>
      <p className="ask-header">Ask a question!</p>
      <form onSubmit={handleSubmit} className="ask-wrapper">
        <div className="ask-div">
          <label htmlFor="title" className="login-label">Question Title:</label>
          <input
            type="text"
            name="question_title"
            id="question_title"
            onChange={handleQuestionChange}
            required
            className="login-input"
          ></input>
        </div>
        <div className="ask-div">
          <label htmlFor="text" className="login-label">Question Text:</label>
          <textarea
            name="question_text"
            id="question_text"
            onChange={handleQuestionChange}
            required
            className="ask-textarea"
          ></textarea>
        </div>
        <div className="ask-div">
          <label htmlFor="keywords" className="login-label">Keywords:</label>
          <Creatable
            isMulti
            isClearable
            options={keywordList}
            onChange={(value) => handleKeywordChange(value)}
            className="login-input"
          ></Creatable>
        </div>
        <div className="ask-div-buttons">
          <button type="submit" className="ask-submit">Submit</button>
          <button onClick={() => hist.push("/")} className="ask-cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
}

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
      }
    });
    let z = {...question}
    z["newKeywords"] = [...newKeywordNames]
    z["oldKeywords"] = [...oldKeywordIds]
    setQuestion(z)
    let ask_options = {
      method: "post",
      url: "http://localhost:5003/create_question",
      data: {...z, token : token["token"]},
    };
    axios(ask_options)
      .then((res) => {
        alert("Question successfully created, stay tuned for upcoming answers!")
        e.target.reset()
      })
      .catch((error) => alert("Something went wrong..."));
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Question Title:</label>
          <input
            type="text"
            name="question_title"
            id="question_title"
            onChange={handleQuestionChange}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="text">Question Text:</label>
          <textarea
            name="question_text"
            id="question_text"
            onChange={handleQuestionChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="keywords">Keywords:</label>
          <Creatable
            isMulti
            isClearable
            options={keywordList}
            onChange={(value) => handleKeywordChange(value)}
          ></Creatable>
        </div>
        <div>
          <button type="submit">Submit</button>
          <button onClick={() => hist.push("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

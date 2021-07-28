import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
} from "recharts";

export default function Homepage() {
  const [questionsPerKeyword, setQuestionsPerKeyword] = useState([]);
  const [questionsPerDay, setQuestionsPerDay] = useState({});
  const [token, setToken] = useState({});

  useEffect(() => {
    let t = JSON.parse(localStorage.getItem("ask-me-anything-token"));
    setToken(t);
    let qpk_options = {
      method: "post",
      url: "http://localhost:5001/questions_per_keyword",
      data: t,
    };
    let qpd_options = {
      method: "post",
      url: "http://localhost:5001/questions_per_day",
      data: t,
    };
    axios.all([axios(qpk_options), axios(qpd_options)]).then(axios.spread((...responses)=>{
      console.log(responses)
      setQuestionsPerKeyword(responses[0]["data"]);
      setQuestionsPerDay(responses[1]["data"]);
    })).catch((errors) => console.log(errors))
    console.log(questionsPerKeyword);
  }, []);

  let history = useHistory();
  const handleRedirect = (destination) => {
    history.push("/" + destination);
  };

  return (
    <div>
      <h2>Welcome to AskMeAnything</h2>
      <table>
        <tbody>
          <tr>
            <td>
              <button onClick={() => handleRedirect("ask")}>
                Ask a question
              </button>
              <button onClick={() => handleRedirect("answer")}>
                Answer a question
              </button>
            </td>
            <td>
              <BarChart
                width={730}
                height={250}
                data={questionsPerKeyword}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword_title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="question_number" fill="#00a0fc" />
              </BarChart>
            </td>
            <td>
              <LineChart
                width={730}
                height={250}
                data={questionsPerDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="question_number" stroke="#8884d8" />
              </LineChart>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

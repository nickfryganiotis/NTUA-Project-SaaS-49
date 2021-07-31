import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function QuestionsPerKeyword(){
    const [questionsPerKeyword, setQuestionsPerKeyword] = useState([]);

    useEffect(() => {
        let t = JSON.parse(localStorage.getItem("ask-me-anything-token"));
        let qpk_options = {
          method: "post",
          url: "https://ask-me-anything-49-analytics.herokuapp.com/questions_per_keyword",
          data: t,
        };
        axios(qpk_options)
          .then((res) => {
              setQuestionsPerKeyword(res.data);
            })
          .catch((errors) => console.log(errors));
      }, []);

    return(
        <div>
        <h2 className="graph-header">Questions per Keyword</h2>
        <div className="graph-wrapper">
          <BarChart
            width={1030}
            height={450}
            data={questionsPerKeyword}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="keyword_title" stroke="midnightblue" />
            <YAxis stroke="midnightblue" />
            <Tooltip />
            <Bar dataKey="question_number" fill="blue"></Bar>
          </BarChart>
        </div>
        </div>
    )
}
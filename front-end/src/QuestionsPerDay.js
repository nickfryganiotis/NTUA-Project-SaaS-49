import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function QuestionsPerDay(){
    const [questionsPerDay, setQuestionsPerDay] = useState({});

    useEffect(() => {
        let t = JSON.parse(localStorage.getItem("ask-me-anything-token"));
        let qpd_options = {
            method: "post",
            url: "https://ask-me-anything-49-analytics.herokuapp.com/questions_per_day",
            data: t,
          };
        axios(qpd_options)
          .then((res) => {
              setQuestionsPerDay(res.data);
            })
          .catch((errors) => console.log(errors));
      }, []);

      function timeConverter(UNIX_timestamp) {
        if (UNIX_timestamp) {
          let x = Date.parse(UNIX_timestamp);
          let a = new Date(x);
          let year = a.getFullYear();
          let month = a.getMonth() + 1;
          let date = a.getDate();
          let tim2 = date + "/" + month + "/" + year;
          return tim2;
        }
        return null;
      }

    return(
        <div className="graph-div">
          <h2 className="graph-header">Questions per Day</h2>
          <div className="graph-wrapper">
          <LineChart
            width={1030}
            height={450}
            data={questionsPerDay}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="day" tickFormatter={timeConverter} stroke="midnightblue"/>
            <YAxis stroke="midnightblue"/>
            <Tooltip />
            <Line
              type="monotone"
              dataKey="question_number"
              stroke="blue"
            ></Line>
          </LineChart>
        </div>
        </div>
    )
}
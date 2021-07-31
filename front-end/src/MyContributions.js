import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend} from "recharts";
import { useHistory } from "react-router-dom";

export default function MyContributions() {
  const [contributions, setContributions] = useState([]);
  let history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("ask-me-anything-token") === null) {
      history.replace("/sign_in");
    } else {
      let t = JSON.parse(localStorage.getItem("ask-me-anything-token"));
      axios({
        method: "post",
        url: "http://localhost:5001/my_contributions_per_day",
        data: t,
      })
        .then((res) => {setContributions(res.data);console.log(res.data)})
        .catch((error) => console.log(error));
    }
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

  return (
    <div>
      <h2 className="graph-header">My Contributions</h2>
      <div className="graph-wrapper">
        <BarChart
          width={1130}
          height={450}
          data={contributions}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="date1" tickFormatter={timeConverter} stroke="midnightblue" />
          <YAxis stroke="midnightblue" />
          <Tooltip />
          <Legend />
          <Bar name="Questions" type="monotone" dataKey="count1" fill="darkgreen" />
          <Bar name="Answers" type="monotone" dataKey="count2" fill="darkred" />
        </BarChart>
      </div>
    </div>
  );
}

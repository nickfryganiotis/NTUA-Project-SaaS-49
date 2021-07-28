import React from "react";
import { useHistory } from "react-router-dom";


export default function Profile() {
  let history = useHistory();
  const handleRedirect = (destination) => {
    history.push("/" + destination);
  };
  return (
    <div>
      <h2>My AskMeAnything</h2>
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
            <td>PLACEHOLDER FOR GRAPH</td>
            <td>PLACEHOLDER FOR GRAPH</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import { Link, useHistory } from "react-router-dom";

export default function Homepage() {

  let history = useHistory();
  const handleRedirect = (destination) => {
    history.push("/" + destination);
  };

  return (
    <div>
      <div className="homepage-wrapper">
        <div>
          <button
            onClick={() => handleRedirect("questions-per-keyword")}
            className="homepage-button"
          >
            Questions per Keyword
          </button>
        </div>
        <div>
          <button
            onClick={() => handleRedirect("questions-per-day")}
            className="homepage-button"
          >
            Questions per Day
          </button>
        </div>
        <div>
          <button
            onClick={() => handleRedirect("ask")}
            className="homepage-button"
          >
            Ask a question
          </button>
        </div>
        <div>
          <button
            onClick={() => handleRedirect("answer")}
            className="homepage-button"
          >
            Answer a question
          </button>
        </div>
      </div>
      <div className="homepage-bottom">
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/nickfryganiotis/NTUA-Project-SaaS-49">Contact Us</a>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/nickfryganiotis/NTUA-Project-SaaS-49" >Documentation</a>
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/nickfryganiotis/NTUA-Project-SaaS-49" >Github Page</a>
      <a target="_blank" rel="noopener noreferrer" href="https://courses.pclab.ece.ntua.gr/course/view.php?id=34" >Course Materials</a>
      </div>
    </div>
  );
}

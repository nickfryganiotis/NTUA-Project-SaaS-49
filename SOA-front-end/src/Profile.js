import React, { useEffect } from "react";
import {useHistory } from "react-router-dom";

export default function Profile() {
  let history = useHistory();
  const handleRedirect = (destination) => {
    history.push("/" + destination);
  };

  useEffect(() => {
    if (localStorage.getItem("ask-me-anything-token") === null) {
      history.replace("/sign_in");
    }
  }, []);

  return (
    <div>
      <div className="homepage-wrapper">
        <div>
          <button
            onClick={() => handleRedirect("my-qna")}
            className="homepage-button"
          >
            My Questions and Answers
          </button>
        </div>
        <div>
          <button
            onClick={() => handleRedirect("my-contributions")}
            className="homepage-button"
          >
            My Contributions
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
    </div>
  );
}

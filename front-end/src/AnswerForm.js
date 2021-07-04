import React, { useState } from "react";

export default function AnswerForm() {
  const [answer, setAnswer] = useState({});
  const handleQuestionChange = (e) => {
    const { value, name } = e.target;
    setAnswer({ ...answer, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Answer a Question</h2>
      <div>
        <label htmlFor="question">Select question</label>
        <select name="question" id="question">
          <option></option>
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Your answer</label>
          <input
            type="textbox"
            name="text"
            id="text"
            onChange={handleQuestionChange}
            required
          ></input>
        </div>
        <div>
          <button type="submit">Submit</button>
          <button type="reset">Cancel</button>
        </div>
      </form>
    </div>
  );
}

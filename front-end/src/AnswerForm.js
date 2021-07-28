import React, { useEffect, useState } from "react";

export default function AnswerForm() {
  const [answer, setAnswer] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    //MAKE API CALL FOR QUESTIONS
  }, []);

  useEffect(() => {
    //MAKE API CALL FOR ANSWERS AND KEYWORDS
  }, [selectedQuestion]);

  const handleQuestionChange = (e) => {
    const { value, name } = e.target;
    setAnswer({ ...answer, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleAnswerChange = (e) => {
    const { value, name } = e.target;
    setSelectedQuestion(value);
  };

  return (
    <div>
      <h2>Answer a Question</h2>

      <div>
        <label htmlFor="question">Select question</label>
        <select name="question" id="question" onChange={handleAnswerChange}>
          <option></option>
          {questions.length !== 0 &&
            questions.map((question) => (
              <option value={question["question_id"]}>
                {question["question_title"]}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="keywords">Keywords:</label>
        {keywords.length !== 0 &&
          keywords.map((keyword) => <div>{keyword["keyword_title"]}</div>)}
      </div>

      <div>
        <label htmlFor="question_text">Question Text:</label>
        {questions.length !== 0 &&
          questions.map((question) => {
            if (question["question_id"] === selectedQuestion) {
              return <p>{question["question_text"]}</p>;
            }
          })}
      </div>

      <div>
        <label htmlFor="selected-answers">Answers:</label>
        {answers.length !== 0 &&
          answers.map((ans) => {
            return <div>{ans["answer_text"]}</div>;
          })}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Your answer</label>
          <textarea
            name="text"
            id="text"
            onChange={handleQuestionChange}
            required
          ></textarea>
        </div>
        <div>
          <button type="submit">Submit</button>
          <button type="reset">Cancel</button>
        </div>
      </form>
    </div>
  );
}

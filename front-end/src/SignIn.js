import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function SignIn() {
  const [credentials, setCredentials] = useState({});
  const hist = useHistory()
  const handleChange = (e) => {
    const { value, name } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth_options = {
      method: "POST",
      url: "http://localhost:3002/sign_in",
      data: credentials,
    };
    axios(auth_options)
      .then((res) => {
        const token = res.data
        localStorage.setItem("ask-me-anything-token", JSON.stringify(token))
        hist.push("/")
      })
      .catch((error) => {
        console.log(error)
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          ></input>
        </div>
      </form>
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

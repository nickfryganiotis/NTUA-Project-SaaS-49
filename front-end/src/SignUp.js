import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function SignUp() {
  const [user, setUser] = useState({});
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };
  const hist = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.hasOwnProperty("password") && user.hasOwnProperty("re-password")) {
      if (user["password"] === user["re-password"]) {
        let x = {...user}
        delete x['re-password']
        let signup_options = {
          method: "post",
          url: "https://ask-me-anything-49-auth.herokuapp.com/sign_up",
          data: x
        }
        axios(signup_options).then((res) =>  {
          alert("Successfully created your account!")
          hist.push("/sign_in")
        })
        .catch((error) => {
          console.log(error)
        })


      } else {
        alert("Passwords must match!");
      }
    }
    console.log(user);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    hist.push("/")
  };

  return (
    <div>
      <p className="login-header">Sign Up</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="ask-div">
          <label htmlFor="username" className="login-label">Email (username):</label>
          <input
            type="email"
            name="username"
            id="username"
            onChange={handleChange}
            className="login-input"
          ></input>
        </div>
        <div className="ask-div">
          <label htmlFor="password" className="login-label">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            className="login-input"
          ></input>
        </div>
        <div className="ask-div">
          <label htmlFor="re-password" className="login-label">Re-enter password:</label>
          <input
            type="password"
            name="re-password"
            id="re-password"
            onChange={handleChange}
            className="login-input"
          ></input>
        </div>
        <div className="ask-div-buttons">
            <button type="submit" className="ask-submit">
              Sign me up
            </button>
            <button className="ask-cancel" onClick={handleCancel}>
              Cancel
            </button>
        </div>
        <div>
        <Link to="/sign_in" className="signup-link">Already have an account?</Link>
      </div>
      </form>
      </div>
  );
}

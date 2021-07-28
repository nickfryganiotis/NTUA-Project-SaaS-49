import React, { useContext, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { NavContext } from "./context/NavContext";

export default function SignIn() {
  const [credentials, setCredentials] = useState({});
  const [isSignedIn, setIsSignedIn] = useContext(NavContext)
  const hist = useHistory()

  const handleChange = (e) => {
    const { value, name } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(credentials)
    const auth_options = {
      method: "post",
      url: "http://localhost:5000/sign_in",
      data: credentials,
    };
    axios(auth_options)
      .then((res) => {
          console.log(res)
          const token = res.data
          localStorage.setItem("ask-me-anything-token", JSON.stringify(token))
          setIsSignedIn("profile-logout")
          hist.push("/")
      })
      .catch((error) => {
        alert("Wrong username or password.")
        e.target.reset()
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

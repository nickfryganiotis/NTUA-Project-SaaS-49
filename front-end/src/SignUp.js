import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [user, setUser] = useState({});
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.hasOwnProperty("password") && user.hasOwnProperty("re-password")) {
      if (user["password"] === user["re-password"]) {
        console.log(user);
      } else {
        alert("Passwords must match!");
      }
    }
    console.log(user);
  };

  const handleCancel = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email (username):</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <label htmlFor="re-password">Re-enter password:</label>
          <input
            type="password"
            name="re-password"
            id="re-password"
            onChange={handleChange}
          ></input>
        </div>
        <div>
          <button type="submit">Signup</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
      <div>
        <Link to="/sign_in">Already have an account?</Link>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function SignIn() {
  const [credentials, setCredentials] = useState({});

  const handleChange = (e) => {
    const { value, name } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //MAKE LOGIN API CALL
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

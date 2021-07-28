import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavContext } from "./context/NavContext";

export default function Navbar() {
  let history = useHistory();
  const [isSignedIn, setIsSignedIn] = useContext(NavContext);

  const handleRedirect = (destination = "home") => {
    let url = "/";
    if (destination !== "home") {
      url = url + destination;
    }
    history.push(url);
  };

  const signOut = () => {
    localStorage.removeItem("ask-me-anything-token");
    setIsSignedIn(false);
    handleRedirect();
  };

  if (isSignedIn) {
    return (
      <div className="ama-header">
        <div className="ama-logo" onClick={() => handleRedirect()}>
          Ask Me Anything
        </div>

        <div className="ama-logo">
          <button onClick={signOut}>Sign Out</button>
          <button
            onClick={() => {
              handleRedirect("profile");
            }}
          >
            <i class="gg-profile"></i>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="ama-header">
        <div className="ama-logo" onClick={handleRedirect}>
          Ask Me Anything
        </div>

        <div className="ama-logo">
          <button
            onClick={() => {
              handleRedirect("sign_up");
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    );
  } 
}

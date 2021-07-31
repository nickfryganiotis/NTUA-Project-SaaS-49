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

        <div className="ama-buttons">
          <button
            onClick={() => {
              handleRedirect("profile");
            }}
            className="ama-profile"
          >
            My Profile
          </button>
          <button onClick={signOut} className="ama-signout">Sign Out</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="ama-header">
        <div className="ama-logo" onClick={()=>handleRedirect()}>
          Ask Me Anything
        </div>

        <div className="ama-buttons">
          <button
            onClick={() => {
              handleRedirect("sign_up");
            }}
            className="ama-signup"
          >
            Sign up
          </button>
        </div>
      </div>
    );
  } 
}

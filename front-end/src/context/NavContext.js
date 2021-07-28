import { createContext, useEffect, useState } from "react";

export const NavContext = createContext(null);

export const NavProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("ask-me-anything-token") === null) setIsSignedIn(false)
    else setIsSignedIn(true)
  }, [])
  return (
    <NavContext.Provider value={[isSignedIn, setIsSignedIn]}>
      {children}
    </NavContext.Provider>
  );
};

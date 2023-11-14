import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);
function LoginProvider({ children }) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }

  function isAuthenticated() {
    // 로그인 되어있는지 확인 하는 함수
    return login !== "";
  }

  function isAdmin() {
    if (login.auth) {
      return login.auth.some((elem) => elem.name === "admin");
    }
    return false;
  }

  function hasAccess(userId) {
    return login.id === userId;
  }
  return (
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;

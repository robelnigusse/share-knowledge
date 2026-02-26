import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = Cookies.get("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      Cookies.remove("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => Cookies.get("token") || "");

  useEffect(() => {
    user
      ? Cookies.set("user", JSON.stringify(user), { expires: 1 })
      : Cookies.remove("user");
  }, [user]);

  useEffect(() => {
    token
      ? Cookies.set("token", token, { expires: 1 })
      : Cookies.remove("token");
  }, [token]);

  const login = ({ user: userData, token }) => {
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
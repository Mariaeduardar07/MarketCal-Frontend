// "use client";
// import { createContext, useState, useEffect } from "react";
// import api, { setAuthToken } from "../service/api.js";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setTokenState] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken) {
//       setTokenState(storedToken);
//       setAuthToken(storedToken);
//     }
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = async (email, password) => {
//     const response = await api.post("/auth/login", { email, password });

//     const { token, user } = response.data;

//     setUser(user);
//     setTokenState(token);

//     setAuthToken(token);

//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//   };

//   const logout = () => {
//     setUser(null);
//     setTokenState(null);
//     setAuthToken(null);
//     localStorage.clear();
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

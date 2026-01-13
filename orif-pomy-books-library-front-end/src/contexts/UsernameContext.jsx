import { createContext, useState, useEffect } from "react";

export const UsernameContext = createContext(null);

export function UsernameProvider({ children }) {
  const [username, setUsername] = useState(() =>
    localStorage.getItem("username") ? localStorage.getItem("username") : null
  );

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

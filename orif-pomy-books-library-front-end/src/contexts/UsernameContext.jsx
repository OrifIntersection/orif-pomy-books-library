import { createContext, useState, useEffect } from "react";

export const UsernameContext = createContext(null);

export function UsernameProvider({ children }) {
  const [username, setUsername] = useState(null);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

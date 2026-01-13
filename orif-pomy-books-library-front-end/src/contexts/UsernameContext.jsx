import { useContext, createContext, useState } from "react";

export const UsernameContext = createContext(null);

export function UsernameProvider({ children }) {
  const [username, setUsername] = useState(null);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const context = useContext(UsernameContext);
  if (!context)
    throw new Error("useUsername must be used within UsernameProvider");

  return context;
}

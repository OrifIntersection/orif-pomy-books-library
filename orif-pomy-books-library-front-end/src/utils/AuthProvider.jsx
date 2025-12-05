import { AuthContext } from "../contexts/AuthContext";
import { useState, useMemo } from "react";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const value = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

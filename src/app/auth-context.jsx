import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = localStorage.getItem("grand-atlas-user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Could not read the saved user profile.", error);
    localStorage.removeItem("grand-atlas-user");
    localStorage.removeItem("grand-atlas-token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    function handleUnauthorized() {
      localStorage.removeItem("grand-atlas-token");
      localStorage.removeItem("grand-atlas-user");
      setUser(null);
    }

    window.addEventListener("api:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("api:unauthorized", handleUnauthorized);
  }, []);

  function signIn(session) {
    localStorage.setItem("grand-atlas-token", session.token);
    localStorage.setItem("grand-atlas-user", JSON.stringify(session.user));
    setUser(session.user);
  }

  function signOut() {
    localStorage.removeItem("grand-atlas-token");
    localStorage.removeItem("grand-atlas-user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}

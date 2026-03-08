"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  user: any | null;
  setUser: (user: any | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/user",
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (e) {
        console.log("GUEST USER");
      }
    }
    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

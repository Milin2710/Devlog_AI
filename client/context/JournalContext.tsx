"use client";

import { createContext, useContext, useEffect, useState } from "react";

const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [journals, setJournals] = useState([]);

  return (
    <JournalContext.Provider value={{ journals, setJournals }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournals = () => useContext(JournalContext);

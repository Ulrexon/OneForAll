"use client";

import React, { createContext, useContext } from 'react';

const DictionaryContext = createContext<any>(null);

export default function DictionaryProvider({ dictionary, children }: { dictionary: any; children: React.ReactNode }) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider structure.");
  }
  return context;
}

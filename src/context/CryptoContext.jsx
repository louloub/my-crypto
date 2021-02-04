import React, { createContext, useState } from "react";

export const CryptoContext = createContext();

// This context provider is passed to any component requiring the context
export const CryptoProvider = ({ children }) => {
  const [name, setName] = useState("name");
  const [coin, setCoin] = useState("coin");
  const [type, setType] = useState("type");
  const [description, setDescription] = useState("description");

  return (
    <CryptoContext.Provider
      value={{
        name,
        coin,
        type,
        description,
        setName,
        setCoin,
        setType,
        setDescription
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

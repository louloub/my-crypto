import React, { createContext, useState } from "react";

export const CryptoProvider = ({ children }) => {
  const [cryptoListContext, setCryptoListContext] = useState();

  return (
    <CryptoContext.Provider
      value={{
        cryptoListContext,
        setCryptoListContext
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const CryptoContext = createContext();

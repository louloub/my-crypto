import React, { createContext, useState } from "react";

export const CryptoProvider = ({ children }) => {
  const [cryptoListContext, setCryptoListContext] = useState();
  const [trigger, setTrigger] = useState();
  
  return (
    <CryptoContext.Provider
      value={{
        cryptoListContext,
        setCryptoListContext,
        trigger,
        setTrigger
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const CryptoContext = createContext();

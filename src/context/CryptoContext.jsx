import React, { createContext, useState } from "react";

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [list, setList] = useState([{}]);

  return (
    <CryptoContext.Provider
      value={{
        list,
        setList
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;

/*
name,
        coin,
        actualPrice,
        type,
        description,
        setList,
        setName,
        setCoin,
        setActualPrice,
        setType,
        setDescription
*/
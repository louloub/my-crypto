import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoContext from "../context/CryptoContext";
import CryptoTable from "./CryptoTable";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoList = props => {
  const [cryptoList, setCrytpoList] = useState([]);

  // Retrive crypto list on database and push it on context
  useEffect(() => {
    async function fetchData() {
      try {
        const cryptoList = await instance.get(`/cryptolist`);
        setCrytpoList(cryptoList.data);
      } catch (err) {}
    }
    fetchData();
  }, []);

  return (
    <CryptoContext.Provider value={cryptoList}>
      <CryptoTable />
    </CryptoContext.Provider>
  );
};

export default CryptoList;

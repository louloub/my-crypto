import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import axios from "axios";

import CryptoContext from "../context/CryptoContext";
import CryptoTable from "./CryptoTable";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoList = props => {
  const [cryptoList, setCrytpoList] = useState([]);

  useEffect(async () => {
    console.log("in useeffect");
    try {
      const cryptoList = await instance.get(`/cryptolist`);
      setCrytpoList(cryptoList.data);
    } catch (err) {}
  }, []);

  return (
    <CryptoContext.Provider value={cryptoList}>
      <CryptoTable />
    </CryptoContext.Provider>
  );
};

export default CryptoList;

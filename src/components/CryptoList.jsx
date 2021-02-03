import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {CryptoContext} from "../context/CryptoContext";
import CryptoTable from "./CryptoTable";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoList = props => {
  const crypto = useContext(CryptoContext);

  // Retrive crypto list on database and push it on context
  useEffect(() => {
    async function fetchData() {
      try {
        const cryptoList = await instance.get(`/cryptolist`);
        console.log(cryptoList.data)
        for (let i = 0; i < cryptoList.data.length; i++ ){
            crypto.setList(crypto.list.push(cryptoList.data[i]))
            // console.log(crypto.list)
        } 
      } catch (err) {}
    }
    fetchData();
  }, []);

  return (
    <CryptoTable />
  );
};

export default CryptoList;

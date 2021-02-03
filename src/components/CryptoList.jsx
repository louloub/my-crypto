import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoTable from "./CryptoTable";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoList = props => {
    
  return (
    <CryptoTable/>
  );
};

export default CryptoList;

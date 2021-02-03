import React, {useEffect, useState} from "react";
import { Table } from "reactstrap";
import axios from 'axios';

const RetrieveCryptoFromDB = props => {
  const [cryptoList, setCrytpoList] = useState([]);

  useEffect(() => {
    axios
      .get(`/cryptolist`)
      .then((res) => setCrytpoList(res.data[0]))
  }, []);

  return {cryptoList};
};

export default RetrieveCryptoFromDB;

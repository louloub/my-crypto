import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";

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
    <Table responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Coin</th>
          <th>Actual Price</th>
          <th>Type</th>
          <th>Market cap</th>
        </tr>
      </thead>
      <tbody>
        {cryptoList.map(crypto => {
          return (
          <tr>
              <td>{crypto.name}</td>
              <td>{crypto.coin}</td>
              <td>Actual price</td>
              <td>{crypto.type}</td>
              <td>Market cap</td>
          </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default CryptoList;

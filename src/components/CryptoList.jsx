import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoList = props => {
  const [cryptoList, setCrytpoList] = useState([]);

  useEffect(() => {
    console.log("in useeffect");
    try {
      instance.get(`/cryptolist`).then(res => setCrytpoList(res.data[0]));
    } catch (err) {}
  }, []);

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Coin</th>
          <th>Actual Price</th>
          <th>Type</th>
          <th>Market cap</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
          <td>Table cell</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default CryptoList;

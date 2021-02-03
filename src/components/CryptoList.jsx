import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";

const CryptoList = props => {
  const [cryptoList, setCrytpoList] = useState([]);

  useEffect(() => {
    axios.get(`/cryptolist`).then(res => setCrytpoList(res.data[0]));
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

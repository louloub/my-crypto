import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";

import CryptoContext from "../context/CryptoContext";

const CryptoTable = props => {
  const cryptos = useContext(CryptoContext);

  if (cryptos != undefined) {
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
          {cryptos.map(crypto => {
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
  } else {
    return "rien";
  }
};

export default CryptoTable;

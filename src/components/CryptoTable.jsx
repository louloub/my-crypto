import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import axios from "axios";

import CryptoContext from "../context/CryptoContext";
let coinCeckoBaseUrl = "https://api.coingecko.com/api/v3/simple/price?ids=";

const CryptoTable = props => {
  const cryptos = useContext(CryptoContext);
  const setCrypto = useContext(CryptoContext);
  
  async function retrieveCoinPrice() {
    cryptos.map(async crypto => {
      const coinName = crypto.name;
      console.log(coinName);
      const coinCeckoFinalUrl =
        coinCeckoBaseUrl + coinName.toLowerCase() + "&vs_currencies=USD";
      console.log(coinCeckoFinalUrl);
      try {
        const coinInformation = await axios
          .create({ baseURL: coinCeckoFinalUrl })
          .get();
        console.log(coinInformation);
        const coinPrice = coinInformation.data.coinName.usd;
        console.log(coinPrice);
      } catch (err) {
        console.log(err);
      }
    });
  }

  useEffect(async () => {
    try {
      retrieveCoinPrice();
    } catch (err) {}
  }, []);

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

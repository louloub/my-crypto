import React, { useEffect, useContext } from "react";
import { Table } from "reactstrap";
import axios from "axios";

import CryptoContext from "../context/CryptoContext";
let coinCeckoBaseUrl = "https://api.coingecko.com/api/v3/simple/price?ids=";

const CryptoTable = props => {
  const cryptos = useContext(CryptoContext);
  const setCrypto = useContext(CryptoContext);

  async function retrieveCoinPrice() {
    cryptos.map(async crypto => {
      let coinPrice = "";
      const coinName = crypto.name.toLowerCase();
      const coinCeckoFinalUrl =
        coinCeckoBaseUrl + coinName + "&vs_currencies=USD";
      try {
        console.log(coinCeckoFinalUrl);
        const coinInformation = await axios
          .create({ baseURL: coinCeckoFinalUrl })
          .get();

        switch (coinName) {
          case "bitcoin":
            coinPrice = coinInformation.data.bitcoin.usd;
            setCrypto(crypto.actualPrice = coinPrice)
            console.log(coinPrice);
            break;
          case "ethereum":
            coinPrice = coinInformation.data.ethereum.usd;
            console.log(coinPrice);
            break;
          case "litecoin":
            coinPrice = coinInformation.data.litecoin.usd;
            console.log(coinPrice);
            break;
        }
        for (const property in crypto){
            console.log(`${property}`)
        }
        // setCrypto()
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
    return "no coin actually";
  }
};

export default CryptoTable;

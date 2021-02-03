import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";
import { Button } from "reactstrap";

let coinCeckoBaseUrl = "https://api.coingecko.com/api/v3/simple/price?ids=";
const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoTable = props => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const cryptoList = await instance.get(`/cryptolist`);
        let newList = [];
        for (let i = 0; i < cryptoList.data.length; i++) {
          newList.push(cryptoList.data[i]);
        }
        setCryptos(newList);
        retrieveCoinPrice();
      } catch (err) {}
    }
    fetchData();
  }, []);

  // Actualy just update actual price with actual coingeck price
  // on click button & database price
  async function updateAllAcutalPriceInDatabase(coinPrice, cryptoId) {
    try {
      const cryptoList = await instance.post(`/cryptolist`, {
        id: cryptoId,
        actualPrice: coinPrice
      });
    } catch (err) {}
  }

  // Delete works only in state
  async function deleteCoin(id) {
    let newArray = cryptos;
    newArray = newArray.filter(function(item) {
      console.log(newArray);
      return item.id !== id;
    });
    setCryptos(newArray);
  }

  async function retrieveCoinPrice() {
    if (cryptos.length > 0) {
      cryptos.map(async (crypto, index) => {
        try {
          let coinPrice = "";
          const coinName = crypto.name.toLowerCase();
          const coinCeckoFinalUrl =
            coinCeckoBaseUrl + coinName + "&vs_currencies=USD";
          const coinInformation = await axios
            .create({ baseURL: coinCeckoFinalUrl })
            .get();

          switch (coinName) {
            case "bitcoin":
              coinPrice = coinInformation.data.bitcoin.usd;
              await setCryptos([
                ...cryptos,
                (cryptos[index].actualPrice = coinPrice)
              ]);
              updateAllAcutalPriceInDatabase(coinPrice, cryptos[index].id);
              break;
            case "ethereum":
              coinPrice = coinInformation.data.ethereum.usd;
              await setCryptos([
                ...cryptos,
                (cryptos[index].actualPrice = coinPrice)
              ]);
              updateAllAcutalPriceInDatabase(coinPrice, cryptos[index].id);
              break;
            case "litecoin":
              coinPrice = coinInformation.data.litecoin.usd;
              await setCryptos([
                ...cryptos,
                (cryptos[index].actualPrice = coinPrice)
              ]);
              updateAllAcutalPriceInDatabase(coinPrice, cryptos[index].id);
              break;
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  }

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto, index) => {
            return (
              <tr>
                <td>{crypto.name}</td>
                <td>{crypto.coin}</td>
                <td>{crypto.actualPrice}</td>
                <td>{crypto.type}</td>
                <td>Market cap</td>
                <td>
                  <Button onClick={() => deleteCoin(crypto.id)} color="warning">
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <Button onClick={() => retrieveCoinPrice()} color="primary">
          Update all price
        </Button>
      </Table>
    );
  } else {
    return "no coin actually";
  }
};

export default CryptoTable;

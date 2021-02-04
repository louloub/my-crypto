import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";
import { Button } from "reactstrap";
import FloatingButton from "./FloatingButton";

let coinCeckoBaseUrl = "https://api.coingecko.com/api/v3/simple/price?ids=";
const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoTable = props => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Retrive list from database and update state with it
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

  async function updateAllAcutalPriceInDatabase(coinPrice, cryptoId) {
    try {
      // Update all crypto price, retrieve new list and set state with it
      const cryptoList = await instance.post(`/cryptolist`, {
        id: cryptoId,
        actualPrice: coinPrice
      });
      const newList = await instance.get(`/cryptolist`);
      setCryptos(newList.data);
    } catch (err) {}
  }

  async function deleteCryptoOnDatabase(cryptoId) {
    try {
      // Delete crypto in database
      const cryptoList = await instance.delete(`/cryptolist/${cryptoId}`);
    } catch (err) {
      console.log(err);
    }
  }

  // Delete works only in state
  async function deleteCoin(id) {
    let newArray = cryptos;
    newArray = newArray.filter(function(item) {
      return item.id !== id;
    });
    setCryptos(newArray);
    deleteCryptoOnDatabase(id);
  }

  async function setStateAndDatabaseWithNewPrice(
    setCryptos,
    cryptos,
    index,
    coinPrice
  ) {
    await setCryptos([...cryptos, (cryptos[index].actualPrice = coinPrice)]);
    updateAllAcutalPriceInDatabase(coinPrice, cryptos[index].id);
  }

  async function siwtchOnCryptoNameForUpdatePrice(
    coinName,
    coinPrice,
    coinInformation,
    setStateAndDatabaseWithNewPrice,
    setCryptos,
    cryptos,
    index
  ) {
    // FUNCTION pour remplacer switch
    switch (coinName) {
      case "bitcoin":
        coinPrice = coinInformation.data.bitcoin.usd;
        await setStateAndDatabaseWithNewPrice(
          setCryptos,
          cryptos,
          index,
          coinPrice
        );
        break;
      case "ethereum":
        coinPrice = coinInformation.data.ethereum.usd;
        await setStateAndDatabaseWithNewPrice(
          setCryptos,
          cryptos,
          index,
          coinPrice
        );
        break;
      case "litecoin":
        coinPrice = coinInformation.data.litecoin.usd;
        await setStateAndDatabaseWithNewPrice(
          setCryptos,
          cryptos,
          index,
          coinPrice
        );
        break;
    }

    return coinPrice;
  }

  // Retrive online crypto price
  async function retrieveCoinPrice() {
    if (cryptos.length > 0) {
      // TODO : USE FOR EACH
      cryptos.forEach(async (crypto, index) => {
        try {
          let coinPrice = "";
          const coinName = crypto.name.toLowerCase();
          const coinCeckoFinalUrl =
            coinCeckoBaseUrl + coinName + "&vs_currencies=USD";
          const coinInformation = await axios
            .create({ baseURL: coinCeckoFinalUrl })
            .get();
          coinPrice = await siwtchOnCryptoNameForUpdatePrice(
            coinName,
            coinPrice,
            coinInformation,
            setStateAndDatabaseWithNewPrice,
            setCryptos,
            cryptos,
            index
          );
        } catch (err) {
          console.log(err);
        }
      });
    }
  }

  // Retrieve new crypto from FLOATING BUTTON componant
  function handleCallback(childData) {
    setCryptos([...cryptos, childData])
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
        <FloatingButton parentCallback={handleCallback} />
      </Table>
    );
  } else {
    return "no coin actually";
  }
};

export default CryptoTable;

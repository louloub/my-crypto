import React, { useEffect, useContext, useRef, useState } from "react";
import { Table } from "reactstrap";
import axios from "axios";
import { Button } from "reactstrap";
import FloatingButton from "./FloatingButton";
import _ from 'lodash';

let coinCeckoBaseUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=";
let coinCeckoBaseUrlEnd =
  "&order=market_cap_desc&per_page=100&page=1&sparkline=false";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoTable = () => {

  // All crypto list
  const [cryptoList, setCryptoList] = useState([])

  // Use to trigger cryptoList update from database
  const [updateDatabase, setUpdateDatabase] = useState(true)

  // Set cryptoList with DB when updateDatabase is true
  useEffect(() => {

    (async () => {
      try {

        const retrieveList = await instance.get(`/cryptoList`);

        if (updateDatabase) {
          setCryptoList(retrieveList.data)
          setUpdateDatabase(false)
        }

      } catch (err) {
        console.log(err);
      }
    })()

  }, [updateDatabase, cryptoList]);

  /**
   * Delete crypto trigger when click on delete button
   * @param crypto : crypto to delete
   */
  async function deleteCoin(crypto) {

    await deleteCryptoOnDatabase(crypto.id);
    setUpdateDatabase(true)

  }

  /**
   * Delete crypto on database 
   * @param cryptoId : crypto id to delete
   */
  async function deleteCryptoOnDatabase(cryptoId) {
    try {
      await instance.delete(
        `/cryptolist/${cryptoId}`
      );
    } catch (err) {
      console.log(err);
    }
    setUpdateDatabase(true)
  }

  /**
   * Trigger when click on "update data" button
   * Update all crypto price and market cap from coingecko
   */
  async function retrieveCoinPrice() {

    let newList = [...cryptoList];

    if (newList) {

      newList.forEach(async crytpo => {

        try {

          // Axios Request
          const coinInformation = await axios
            .create({ baseURL: getCoinGeckoUrlRequest(crytpo) })
            .get();

          if (coinInformation.data[0]) {
            // Update coin data
            crytpo.actualPrice = await coinInformation.data[0].current_price;
            crytpo.marketCap = await coinInformation.data[0].market_cap;
          } else {
            crytpo.actualPrice = "no price"
            crytpo.marketCap = "no market cap"
          }

          await instance.post(`/updateCrypto`, {
            id: crytpo.id,
            actualPrice: crytpo.actualPrice,
            marketCap: crytpo.marketCap
          });

          setUpdateDatabase(true)
        } catch (err) {
          console.log(err);
        }

      })

    }

  }

  /**
   * Retrieve new crypto from floating button componant
   * @param childData is new crypto
   */
  async function handleCallback(childData) {

    let newCoin = childData;

    try {
      const coinInformation = await axios
        .create({ baseURL: getCoinGeckoUrlRequest(newCoin) })
        .get();

      if (coinInformation.data[0]) {
        newCoin.actualPrice = await (coinInformation.data[0].current_price).toString();
        newCoin.marketCap = await (coinInformation.data[0].market_cap).toString();
      } else {
        newCoin.actualPrice = "no price"
        newCoin.marketCap = "no market cap"
      }
      setUpdateDatabase(true)

      await instance.post(`/cryptolist/newCrypto`, {
        newCoin
      });

      setUpdateDatabase(true)
    } catch (err) {
      console.log(err);
    }

  }

  /**
   * Create coingecko url request for coin
   * @param coin to retrieve url
   * @returns complete coingecko url
   */
  function getCoinGeckoUrlRequest(coin) {
    return coinCeckoBaseUrl + coin.name.toLowerCase() + coinCeckoBaseUrlEnd;
  }

  try {

    return (
      <Table responsive hover>
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
          {cryptoList.map((crypto, index) => {
            return (
              <tr key={index}>
                <td>{crypto.name}</td>
                <td>{crypto.coin}</td>
                <td>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "USD"
                  }).format(crypto.actualPrice)}
                </td>
                <td>{crypto.type}</td>
                <td>
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "USD"
                  }).format(crypto.marketCap)}
                </td>
                <td>
                  <Button onClick={() => deleteCoin(crypto)} color="warning">
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <Button onClick={() => retrieveCoinPrice()} color="primary">
          Update data
        </Button>
        <FloatingButton parentCallback={handleCallback} />
      </Table>
    );
  } catch (err) {
    console.log(err);
    return "loading ...";
  }
};

export default CryptoTable;

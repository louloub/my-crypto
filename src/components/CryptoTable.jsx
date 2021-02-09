import React, { useEffect, useState, useContext } from "react";
import { Table } from "reactstrap";
import axios from "axios";
import { Button } from "reactstrap";
import FloatingButton from "./FloatingButton";
import { CryptoContext } from "../context/CryptoContext";

let coinCeckoBaseUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=";
let coinCeckoBaseUrlEnd =
  "&order=market_cap_desc&per_page=100&page=1&sparkline=false";

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const CryptoTable = props => {
  const [cryptos, setCryptos] = useState([]);
  const cryptoContext = useContext(CryptoContext);

  useEffect(() => {
    console.log("--- use effect --- in use effect");
    // ADD OBJECT IN CONTEXT LIST WORKS DOWN LINE
    // cryptoContext.setCryptoListContext(cryptoContext.cryptoListContext.push({"a":"b"}))
    // THIS UP LINE WORKS

    async function fetchData() {
      try {
        // Retrive list from database and update state with it
        const cryptoList = await instance.get(`/cryptoList`);
        let newList = [];
        for (let i = 0; i < cryptoList.data.length; i++) {
          newList.push(cryptoList.data[i]);
          // If coin have no price, retrive it online
          if (cryptoList.data[i].actualPrice === null) {
            console.log(cryptoList.data[i].name);
            console.log(cryptoList.data[i].marketCap);
            retrieveCoinPrice();
          }
        }
        cryptoContext.setCryptoListContext(newList);
        // cryptoContext.setCryptoListContext(
        //   cryptoContext.cryptoListContext.push({ newList })
        // );
        // console.log(
        //   "cryptoContext.cryptoListContext ==> ",
        //   cryptoContext.cryptoListContext[0].newList
        // );
        setCryptos(newList);
        retrieveCoinPrice();
      } catch (err) {}
    }
    fetchData();
  }, []);

  // 09/02 --> im in this method, for update price of all coin in DB
  // AND AFTER THIS, UPDATE CONTEXT WITH NEW DB DATA
  // ENJOY
  async function updateAllAcutalPriceInDatabase(coinPrice, cryptoId) {
    try {
      console.log("--- updateAllAcutalPriceInDatabase --- coinPrice => ", coinPrice);
      console.log("--- updateAllAcutalPriceInDatabase --- cryptoId => ", cryptoId);
      // Update all crypto price, retrieve new list and set state with it
      const cryptoList = await instance.post(`/cryptoListPrice`, {
        id: cryptoId,
        actualPrice: coinPrice
      });
      // rconsole.log("--- updateAllAcutalPriceInDatabase --- cryptoList => ", cryptoList);
      const newList = await instance.get(`/cryptolist`);
      setTimeout(console.log("--- updateAllAcutalPriceInDatabase --- cryptoList2 => ", newList),100)

      // cryptoContext.setCryptoListContext(newList);
      // setCryptos(newList.data);
    } catch (err) {}
  }

  async function updateAllAcutalMarketCapInDatabase(coinMarketCap, cryptoId) {
    try {
      console.log("FRONT cryptoId ==> ", cryptoId);
      // Update all crypto price, retrieve new list and set state with it
      const cryptoList = await instance.post(`/cryptoListMarketCap`, {
        id: cryptoId,
        marketCap: coinMarketCap
      });
      const newList = await instance.get(`/cryptoList`);
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
    await setCryptos(newArray);
    await deleteCryptoOnDatabase(id);
  }

  async function setStateAndDatabaseWithNewData(
    setCryptos,
    cryptos,
    index,
    coinPrice,
    coinMarketCap
  ) {
    // console.log("cryptos ==> ", cryptos);
    // console.log("coinPrice ==> ", coinPrice);
    // console.log("cryptos[index].actualPrice ==> ", cryptos[index].actualPrice);
    // console.log("cryptos[index].name ==> ", cryptos[index].name);

    // await setCryptos([...cryptos, (cryptos[index].actualPrice = coinPrice)]);
    // await setCryptos([...cryptos, (cryptos[index].marketCap = coinMarketCap)]);
    // console.log(
    //   "cryptos[index].actualPrice 2 ==> ",
    //   cryptos[index].actualPrice
    // );

    await updateAllAcutalPriceInDatabase(coinPrice, cryptoContext.cryptoListContext[index].id);
    await updateAllAcutalMarketCapInDatabase(coinMarketCap, cryptoContext.cryptoListContext[index].id);
  }

  async function siwtchOnCryptoNameForUpdate(
    coinName,
    coinPrice,
    coinInformation,
    setStateAndDatabaseWithNewData,
    setCryptos,
    cryptos,
    index
  ) {
    coinPrice = coinInformation.data[0].current_price;
    let coinMarketCap = coinInformation.data[0].market_cap;

    await setStateAndDatabaseWithNewData(
      setCryptos,
      cryptos,
      index,
      coinPrice,
      coinMarketCap
    );
  }

  // Retrieve online crypto price
  async function retrieveCoinPrice() {
    console.log(
      "--- retrieveCoinPrice --- cryptoContext.cryptoListContext => ",
      cryptoContext.cryptoListContext
    );
    if (cryptos.length > 0) {
      cryptos.forEach(async (crypto, index) => {
        try {
          let coinPrice = "";
          const coinName = crypto.name.toLowerCase();

          // For online price
          const coinCeckoFinalUrl =
            coinCeckoBaseUrl + coinName + coinCeckoBaseUrlEnd;

          const coinInformation = await axios
            .create({ baseURL: coinCeckoFinalUrl })
            .get();

          await updateAllAcutalPriceInDatabase(
            coinInformation.data[0].current_price,
            cryptos[index].id
          );
          await updateAllAcutalMarketCapInDatabase(
            coinInformation.data[0].market_cap,
            cryptos[index].id
          );

          //   await siwtchOnCryptoNameForUpdate(
          //     coinName,
          //     coinPrice,
          //     coinInformation,
          //     setStateAndDatabaseWithNewData,
          //     setCryptos,
          //     cryptos,
          //     index
          //   );
        } catch (err) {
          console.log(err);
        }
      });
    }
  }

  // Retrieve new crypto from FLOATING BUTTON componant
  async function handleCallback(childData) {
    let newArray = cryptos;
    let newCoin = childData;
    newArray.push(childData);
    // setCryptos(newArray);
    // console.log("--- handleCallback --- cryptos ==> ", cryptos);
    // await retrieveCoinPrice()
    console.log("--- handleCallback --- newCoin ==> ", newCoin);

    // Post new coin on database
    async function fetchData() {
      console.log("--- fetcData --- ");
      try {
        console.log("FRONT in try");
        const addCoinInDatabse = await instance.post(`/cryptolist/newCrypto`, {
          newCoin
        });
      } catch (err) {
        console.log(err);
      }
    }

    // Retrieve new database
    async function fetcData2() {
      console.log("--- fetcData 2 --- ");
      const cryptoList = await instance.get(`/cryptoList`);
      console.log("--- fetcData 2 / cryptoList => ", cryptoList);
      setTimeout(fetcData3(cryptoList), 200);
    }

    // Set context list with new database
    async function fetcData3(cryptoList) {
      let newList = [];
      for (let i = 0; i < cryptoList.data.length; i++) {
        console.log("--- fetcData 3 ---");
        newList.push(cryptoList.data[i]);
        // If coin have no price, retrive it online
        if (cryptoList.data[i].actualPrice === null) {
          console.log(cryptoList.data[i].name);
          console.log(cryptoList.data[i].marketCap);
          setTimeout(retrieveCoinPrice(), 100);
        }
      }
      cryptoContext.setCryptoListContext(newList);
      //   console.log("NEW LIST ===> ", newList);
      //   setCryptos(newList);
      //   retrieveCoinPrice();
      //   console.log("FRONT in end try");
    }

    fetchData();
    setTimeout(fetcData2, 200);

    // try {
    //   // Add new crypto in database
    //   instance.post(`/cryptolist/newCrypto`, {
    //     newCoin
    //   }).then(function (response) {
    //     console.log("response ==> ",response);
    //   })
    //   // console.log("cryptoList ==> ", cryptoList.data);
    // } catch (err) {
    //   console.log(err);
    // }
    // Add new crytpo in state
    //setCryptos(newArray);
  }

  if (cryptoContext.cryptoListContext != undefined) {
    async function mylog() {
      console.log("--- in render if ---", cryptoContext.cryptoListContext);
    }
    mylog();
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
          {cryptoContext.cryptoListContext.map((crypto, index) => {
            return (
              <tr>
                <td>{crypto.name}</td>
                <td>{crypto.coin}</td>
                <td>{crypto.actualPrice}</td>
                <td>{crypto.type}</td>
                <td>{crypto.marketCap} $</td>
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
          Update data
        </Button>
        <FloatingButton parentCallback={handleCallback} />
      </Table>
    );
  } else {
    return "no coin actually";
  }
};

export default CryptoTable;

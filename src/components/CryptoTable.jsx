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

// 1 - useEffect retrieve list on database
// 2 - set list on context with database
// 3 - can add crypto
// 4 - can delete crypto
// 5 - can update crypto price online
// 6 - can udpate crypto marketcap online
// 7 - when i add crypto his price and market cap are update with online

const CryptoTable = props => {
  const cryptoContext = useContext(CryptoContext);

  useEffect(() => {
    console.log("--- use effect ---");
    let cryptoList = [];
    let newList = [];

    async function retrieveDataFromDatabase() {
      try {
        cryptoList = await instance.get(`/cryptoList`);
        // UPDATE ALL PRICE HERE AND AFTER PUSH LIST IN CONTEXT
        newList.push(cryptoList.data);
        await updateAllContextPriceFromList(newList);
        console.log("--- retrieveDataFromDatabase --- newlist ==> ", newList);
        // await cryptoContext.setCryptoListContext(newList);
      } catch (err) {
        console.log(err);
      }
    }

    // Function to launch saveNewDataOnDatabse after retrieveDataFromDatabase completed
    const handleAsyncFunction = async () => {
      const result = await retrieveDataFromDatabase();
      saveNewDataOnDatabse();
    };

    handleAsyncFunction();
    // retrieveDataFromDatabase();
    // console.log(
    //   "--- retrieveDataFromDatabase --- cryptoContext.cryptoListContext",
    //   cryptoContext.cryptoListContext[0]
    // );
    // saveNewDataOnDatabse();
  }, []);

  async function saveNewDataOnDatabse(cryptoId, coinPrice, marketCap) {

    

    try {
      console.log(
        "--- saveNewDataOnDatabse --- cryptoContext.cryptoListContext",
        cryptoContext.cryptoListContext[0]
      );

      let cryptoArrayFromContext = cryptoContext.cryptoListContext[0];
      for (let i = 0; i < cryptoArrayFromContext.length; i++) {
        console.log("cryptoArrayFromContext => ", cryptoArrayFromContext[i]);
        await instance.post(`/cryptoListPrice`, {
          id: cryptoArrayFromContext[i].id,
          actualPrice: cryptoArrayFromContext[i].actualPrice,
          marketCap: cryptoArrayFromContext[i].marketCap
        });
      }
    } catch (err) {
      console.log("!!! ERROR !!!", err);
    }

    /* 
    const handleAsyncFunction = async () => {
      const result = await retrieveDataFromDatabase();
      saveNewDataOnDatabse();
    };

    handleAsyncFunction();
    */
  }

  async function updateAllContextPriceFromList(newList) {
    // console.log(
    //   "--- updateAllContextPriceFromList --- cryptoList ==> ",
    //   newList
    // );
    // console.log(
    //   "--- updateAllContextPriceFromList --- cryptoContext.cryptoListContext",
    //   cryptoContext.cryptoListContext[0]
    // );
    for (let i = 0; i < newList[0].length; i++) {
      let coin = newList[0][i];
      let name = newList[0][i].name;
      let cryptoId = newList[0][i].id;
      let coinPrice = newList[0][i].actualPrice;

      // Create URL for request
      const coinCeckoFinalUrl =
        coinCeckoBaseUrl + name.toLowerCase() + coinCeckoBaseUrlEnd;

      // Axios Request
      const coinInformation = await axios
        .create({ baseURL: coinCeckoFinalUrl })
        .get();

      // Update coin data in local array
      newList[0][i].actualPrice = coinInformation.data[0].current_price;
      newList[0][i].marketCap = coinInformation.data[0].market_cap;
    }

    // Push local array in context
    await cryptoContext.setCryptoListContext(newList);
  }

  // 09/02 --> im in this method, for update price of all coin in DB
  // AND AFTER THIS, UPDATE CONTEXT WITH NEW DB DATA
  // ENJOY
  async function updateAllAcutalPriceInDatabase(coinName, coinPrice, cryptoId) {
    try {
      console.log(
        "--- updateAllAcutalPriceInDatabase --- cryptoId => ",
        cryptoId
      );
      console.log(
        "--- updateAllAcutalPriceInDatabase --- coinName => ",
        coinName
      );
      console.log(
        "--- updateAllAcutalPriceInDatabase --- coinPrice => ",
        coinPrice
      );

      // Update all crypto price, retrieve new list and set state with it
      const cryptoList = await instance.post(`/cryptoListPrice`, {
        id: cryptoId,
        actualPrice: coinPrice
      });
      // rconsole.log("--- updateAllAcutalPriceInDatabase --- cryptoList => ", cryptoList);
      const newList = await instance.get(`/cryptolist`);
      setTimeout(
        console.log(
          "--- updateAllAcutalPriceInDatabase --- cryptoList2 => ",
          newList
        ),
        100
      );

      // cryptoContext.setCryptoListContext(newList);
      // setCryptos(newList.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function updateAllAcutalMarketCapInDatabase(
    coinName,
    coinMarketCap,
    cryptoId
  ) {
    try {
      console.log(
        "--- updateAllAcutalMarketCapInDatabase --- cryptoId ==> ",
        cryptoId
      );
      // Update all crypto price, retrieve new list and set state with it
      const cryptoList = await instance.post(`/cryptoListMarketCap`, {
        id: cryptoId,
        marketCap: coinMarketCap
      });
      const newList = await instance.get(`/cryptoList`);
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
    // let newArray = cryptos;
    // newArray = newArray.filter(function(item) {
    //   return item.id !== id;
    // });
    // await setCryptos(newArray);
    // await deleteCryptoOnDatabase(id);
  }

  // Retrieve online crypto price
  async function retrieveCoinPrice() {
    setTimeout(
      console.log(
        "--- retrieveCoinPrice --- cryptoContext.cryptoListContext => ",
        cryptoContext.cryptoListContext
      ),
      2000
    );

    setTimeout(ifelse(), 2000);

    async function ifelse() {
      if (cryptoContext.cryptoListContext.length > 0) {
        cryptoContext.cryptoListContext.forEach(async (crypto, index) => {
          try {
            let coinPrice = "";
            const coinName = crypto.name.toLowerCase();

            // For online price
            const coinCeckoFinalUrl =
              coinCeckoBaseUrl + coinName + coinCeckoBaseUrlEnd;

            const coinInformation = await axios
              .create({ baseURL: coinCeckoFinalUrl })
              .get();

            console.log("--- retrieveCoinPrice --- crypto => ", crypto);
            console.log(
              "--- retrieveCoinPrice --- index => ",
              cryptoContext.cryptoListContext[index].id
            );

            // await updateAllAcutalPriceInDatabase(
            //   coinName,
            //   coinInformation.data[0].current_price,
            //   cryptoContext.cryptoListContext[index].id
            // );

            //   await updateAllAcutalMarketCapInDatabase(
            //     coinName,
            //     coinInformation.data[0].market_cap,
            //     cryptoContext.cryptoListContext[index].id
            //   );
          } catch (err) {
            console.log(err);
          }
        });
      } else {
        console.log("cryptoContext.cryptoListContext is empty");
      }
    }
  }

  // Retrieve new crypto from FLOATING BUTTON componant
  async function handleCallback(childData) {
    let newArray = cryptoContext.cryptoListContext;
    let newCoin = childData;
    newArray.push(childData);
    console.log("--- handleCallback --- newCoin ==> ", newCoin);

    // Post new coin on database
    async function fetchData() {
      console.log("--- fetcData --- ");
      try {
        await instance.post(`/cryptolist/newCrypto`, {
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

    // Create new local list with database
    async function fetcData3(cryptoList) {
      let newList = [];
      for (let i = 0; i < cryptoList.data.length; i++) {
        console.log("--- fetcData 3 ---");
        newList.push(cryptoList.data[i]);
        // If coin have no price, retrive it online
        if (cryptoList.data[i].actualPrice === null) {
          console.log("cryptoList.data[i].name => ", cryptoList.data[i].name);
        }
      }
      fetchData4(newList);
    }

    // Push new list on context
    async function fetchData4(newList) {
      console.log(
        "--- fetchData4 --- cryptoContext.cryptoListContext => ",
        cryptoContext.cryptoListContext
      );
      console.log("--- fetchData4 --- newList => ", newList);
      await cryptoContext.setCryptoListContext([]);
      await cryptoContext.setCryptoListContext(newList);
      setTimeout(
        console.log(
          "--- fetchData4 --- cryptoContext.cryptoListContext => ",
          cryptoContext.cryptoListContext
        ),
        1000
      );
    }

    fetchData();
    setTimeout(fetcData2, 200);
    setTimeout(retrieveCoinPrice, 1000);
    console.log("--- END OF handleCallback ---");
  }

  if (cryptoContext.cryptoListContext != undefined) {
    async function mylog() {
      console.log("--- in render if ---", cryptoContext.cryptoListContext[0]);
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
          {cryptoContext.cryptoListContext[0].map((crypto, index) => {
            return (
              <tr>
                <td>{crypto.name}</td>
                <td>{crypto.coin}</td>
                <td>{crypto.actualPrice} $</td>
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

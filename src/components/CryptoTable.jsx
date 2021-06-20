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

const CryptoTable = props => {

  const [cryptoList, setCryptoList] = useState([])
  const [newCrypto, setNewCrypto] = useState()

  // Set cryptoList with DB when cryptoList is modified
  useEffect(() => {

    async function retrieveDataFromDatabase() {

      try {

        const retrieveList = await instance.get(`/cryptoList`);

        if (!(_.isEqual(cryptoList, retrieveList.data)) && newCrypto) {

          const newCoin = newCrypto
          await instance.post(`/cryptolist/newCrypto`, {
            newCoin
          });

          setCryptoList(retrieveList.data)
          setNewCrypto()
        } else if (!(_.isEqual(cryptoList, retrieveList.data))) {
          setCryptoList(retrieveList.data)
        }

      } catch (err) {
        console.log(err);
      }
    }

    // Function to launch saveNewDataOnDatabse after retrieveDataFromDatabase completed
    const handleAsyncFunction = async () => {
      await retrieveDataFromDatabase();
      // saveNewDataOnDatabse();
    };

    handleAsyncFunction();

  }, [cryptoList, newCrypto]);

  async function saveNewDataOnDatabse() {
    // const handleAsyncFunction = async () => {
    //   do {
    //     let cryptoArrayFromContext = await cryptoContext.cryptoListContext[0];
    //     for (let i = 0; i < cryptoArrayFromContext.length; i++) {
    //       console.log(cryptoArrayFromContext[i].actualPrice);
    //       await instance.post(`/cryptoListPrice`, {
    //         id: cryptoArrayFromContext[i].id,
    //         actualPrice: cryptoArrayFromContext[i].actualPrice,
    //         marketCap: cryptoArrayFromContext[i].marketCap
    //       });
    //     }
    //   } while (cryptoContext.cryptoListContext[0] === undefined);
    //   //   if (cryptoContext.cryptoListContext[0] !== undefined) {
    //   //     await saveOnDatabase();
    //   //   } else {
    //   //     handleAsyncFunction();
    //   //   }
    // };
    // handleAsyncFunction();
  }

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
    } catch (err) { }
  }

  async function deleteCryptoOnDatabase(cryptoId) {
    try {
      // Delete crypto in database
      const deleteCrytpoOnDatabase = await instance.delete(
        `/cryptolist/${cryptoId}`
      );
      //   const retrieveCryptoList = await instance.get(`/cryptoList`);
      //   console.log("retrieveCryptoList ==> ",retrieveCryptoList)
      //   await cryptoContext.setCryptoListContext(
      //     [...cryptoContext.cryptoListContext],
      //     [retrieveCryptoList]
      //   );
    } catch (err) {
      console.log(err);
    }
  }

  // Delete works only in state
  async function deleteCoin(id) {
    let newArray = [...cryptoList];
    newArray = newArray.filter(function (item) {
      return item.id !== id;
    });
    // await setCryptos(newArray); TODO
    await deleteCryptoOnDatabase(id);
  }

  async function updateCryptoPrice(coinCeckoFinalUrl, crytpo) {

    let updatedCrypto = { ...crypto }

    // Axios Request
    const coinInformation = await axios
      .create({ baseURL: coinCeckoFinalUrl })
      .get();

    // Update coin data
    updatedCrypto.actualPrice = await coinInformation.data[0].current_price;
    updatedCrypto.marketCap = await coinInformation.data[0].market_cap;

    return updatedCrypto
  }

  /**
   * Trigger when click on "update data" button
   * Update all crypto price and market cap from coingecko
   */
  async function retrieveCoinPrice() {

    let newList = [...cryptoList];

    if (newList) {

      newList.forEach(async crytpo => {

        // Axios Request
        const coinInformation = await axios
          .create({ baseURL: getCoinGeckoUrlRequest(crytpo) })
          .get();

        // Update coin data
        crytpo.actualPrice = await coinInformation.data[0].current_price;
        crytpo.marketCap = await coinInformation.data[0].market_cap;

        await instance.post(`/cryptoListPrice`, {
          id: crytpo.id,
          actualPrice: crytpo.actualPrice,
          marketCap: crytpo.marketCap
        });

      })

      setCryptoList(newList)

    }

  }

  // function updateCryptoPriceAndMarketCap(coin) {

  //   let updateCoin = { ...coin}

  //   const coinInformation = await axios
  //     .create({ baseURL: getCoinGeckoUrlRequest(updateCoin) })
  //     .get();

  //   updateCoin.actualPrice = await(coinInformation.data[0].current_price).toString();
  //   updateCoin.marketCap = await(coinInformation.data[0].market_cap).toString();

  //   return updataCoin
  // }

  /**
   * Retrieve new crypto from FLOATING BUTTON componant
   * @param childData is new crypto
   */
  async function handleCallback(childData) {
    let newArray = [...cryptoList];
    let newCoin = childData;

    const coinInformation = await axios
      .create({ baseURL: getCoinGeckoUrlRequest(newCoin) })
      .get();

    newCoin.actualPrice = await (coinInformation.data[0].current_price).toString();
    newCoin.marketCap = await (coinInformation.data[0].market_cap).toString();

    newArray.push(newCoin);

    setNewCrypto(newCoin)
    setCryptoList(newArray)

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
  } catch (err) {
    console.log(err);
    return "loading ...";
  }
};

export default CryptoTable;
// setCryptoList(newArray)

    // let newList = [...cryptoList];

    // async function udpateContextListPrice() {
    //   console.log(
    //     "--- handleCallback / udpateContextListPrice / newArray --- ==> ",
    //     newArray
    //   );
    //   for (let i = 0; i < newArray.length; i++) {
    //     let coin = newArray[i].coin;
    //     let name = newArray[i].name;
    //     let cryptoId = newArray[i].id;
    //     // let coinPrice = newArray[i].actualPrice;
    //     let type = newArray[i].type;
    //     let descritpion = newArray[i].descruiption;
    //     let marketCap = newArray[i].marketCap;

    //     // Create URL for request
    //     const coinCeckoFinalUrl =
    //       coinCeckoBaseUrl + name.toLowerCase() + coinCeckoBaseUrlEnd;

    //     // Axios Request
    //     const coinInformation = await axios
    //       .create({ baseURL: coinCeckoFinalUrl })
    //       .get();

    //     newArray[i].actualPrice = coinInformation.data[0].current_price;
    //     newArray[i].marketCap = coinInformation.data[0].market_cap;
    //     console.log("--- newArray[i].actualPrice", newArray[i].name);
    //     console.log("--- newArray[i].actualPrice", newArray[i].actualPrice);

    //     // If coin have not price (becauce it's just added) we put coin on database with price
    //     if (newArray[i].id === undefined || newArray[i].id === null) {
    //       console.log("in no price");
    //       let coinPrice = newArray[i].actualPrice.toString();
    //       console.log("funcking price ==> ", coinPrice);
    //       const newCoin = {
    //         name,
    //         coin,
    //         coinPrice,
    //         type,
    //         descritpion,
    //         marketCap
    //       };
    //       await instance.post(`/cryptolist/newCrypto`, {
    //         newCoin
    //       });
    //     }
    //   }

    //   setCryptoList(newArray)

    //   // TODO
    //   // await cryptoContext.setCryptoListContext(
    //   //   [...cryptoContext.cryptoListContext],
    //   //   newList
    //   // );
    //   console.log("--- newArray 2 --- ==> ", newArray);
    // }

    // fetchData();
    // udpateContextListPrice();
    // setTimeout(fetcData2, 200);
    // // setTimeout(retrieveCoinPrice, 1000);
    // console.log("--- END OF handleCallback ---");

    // setCryptoList(newList)

    // 1710,92 176.42 0.39 - 252 947 273 297
    // async function updateStateWithNewList() {
    //   if (cryptoList !== undefined) {
    //     // newList = cryptoList;
    //     console.log("--- retrieveCoinPrice --- newList => ", newList);
    //     await udpateContextListPrice();
    //     console.log("--- retrieveCoinPrice / between --- ");

    //     // await cryptoContext.setCryptoListContext([]);
    //     // console.log(
    //     //   "--- retrieveCoinPrice --- cryptoContext.cryptoListContext[0] AFTER DELETE => ",
    //     //   cryptoContext.cryptoListContext[0]
    //     // );
    //     // console.log(
    //     //   "--- retrieveCoinPrice --- newList AFTER DELETE => ",
    //     //   newList
    //     // );
    //     // await cryptoContext.setCryptoListContext(newList);

    //     // console.log(
    //     //   "--- retrieveCoinPrice / cryptoContext.cryptoListContext[0] --- => ",
    //     //   cryptoContext.cryptoListContext[0]
    //     // );
    //   } else {
    //     retrieveCoinPrice();
    //     console.log("");
    //   }
    // }

    // const handleAsyncFunction = async () => {
    //   const firstResult = await updateStateWithNewList();
    //   console.log("--- handleAsyncFunction / between 1 --- ");
    //   //   const result = await cryptoContext.setCryptoListContext([]);
    //   //   console.log("--- handleAsyncFunction / between 2 --- ");
    //   //   const anotherResult = await cryptoContext.setCryptoListContext(newList);
    //   //   console.log("--- handleAsyncFunction / between 3 --- ");
    // };

    // handleAsyncFunction();

    // async function udpateContextListPrice() {
    //   console.log("--- newList --- ==> ", newList);
    //   for (let i = 0; i < newList.length; i++) {
    //     let coin = newList[i].coin;
    //     let name = newList[i].name;
    //     let cryptoId = newList[i].id;
    //     let coinPrice = newList[i].actualPrice;

    //     // Create URL for request
    //     const coinCeckoFinalUrl =
    //       coinCeckoBaseUrl + name.toLowerCase() + coinCeckoBaseUrlEnd;

    //     // Axios Request
    //     const coinInformation = await axios
    //       .create({ baseURL: coinCeckoFinalUrl })
    //       .get();

    //     // Update coin data in local array
    //     newList[i].actualPrice = coinInformation.data[0].current_price;
    //     newList[i].marketCap = coinInformation.data[0].market_cap;
    //   }
    //   console.log("--- newList 2 --- ==> ", newList);
    // }

//   if (cryptoContext.cryptoListContext[0] !== undefined) {
//     async function mylog() {
//       console.log("--- in render if ---", cryptoContext.cryptoListContext[0]);
//     }
//     mylog();

//   } else {
//     cryptoContext.setCryptoListContext();
//     return "no coin actually";
//   }

/*
//   cryptoContext.cryptoListContext[0].forEach(async (crypto, index) => {
      //     try {
      //       let coinPrice = "";
      //       const coinName = crypto.name.toLowerCase();
      //       console.log();
      //       // For online price
      //       const coinCeckoFinalUrl =
      //         coinCeckoBaseUrl + coinName + coinCeckoBaseUrlEnd;

      //       const coinInformation = await axios
      //         .create({ baseURL: coinCeckoFinalUrl })
      //         .get();

      //       console.log("--- retrieveCoinPrice --- crypto => ", crypto);
      //       console.log(
      //         "--- retrieveCoinPrice --- index => ",
      //         cryptoContext.cryptoListContext[index].id
      //       );

      //       // await updateAllAcutalPriceInDatabase(
      //       //   coinName,
      //       //   coinInformation.data[0].current_price,
      //       //   cryptoContext.cryptoListContext[index].id
      //       // );

      //       //   await updateAllAcutalMarketCapInDatabase(
      //       //     coinName,
      //       //     coinInformation.data[0].market_cap,
      //       //     cryptoContext.cryptoListContext[index].id
      //       //   );
      //     } catch (err) {
      //       console.log(err);
      //     }
      //   });
*/

// // Retrieve new database
// async function fetcData2() {
//   console.log("--- fetcData 2 --- ");
//   const cryptoList = await instance.get(`/cryptoList`);
//   console.log("--- fetcData 2 / cryptoList => ", cryptoList);
//   setTimeout(fetcData3(cryptoList), 200);
// }

// // Create new local list with database
// async function fetcData3(cryptoList) {
//   let newList = [];
//   for (let i = 0; i < cryptoList.data.length; i++) {
//     console.log("--- fetcData 3 ---");
//     newList.push(cryptoList.data[i]);
//     // If coin have no price, retrive it online
//     // if (cryptoList.data[i].actualPrice === null) {
//     //   console.log("cryptoList.data[i].name => ", cryptoList.data[i].name);
//     // }
//   }
//   // fetchData4(newList);
// }

// // Push new list on context
// async function fetchData4(newList) {
//   console.log(
//     "--- fetchData4 --- cryptoContext.cryptoListContext => ",
//     cryptoContext.cryptoListContext
//   );
//   console.log("--- fetchData4 --- newList => ", newList);
//   // await cryptoContext.setCryptoListContext([]);
//   // await cryptoContext.setCryptoListContext(...newList);
//   setTimeout(
//     console.log(
//       "--- fetchData4 --- cryptoContext.cryptoListContext => ",
//       cryptoContext.cryptoListContext
//     ),
//     1000
//   );
// }

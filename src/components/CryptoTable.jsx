import React, { useEffect, useContext, useRef } from "react";
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

function usePrevious(value) {
  console.log("value ==> ", value);
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const CryptoTable = props => {
  const cryptoContext = useContext(CryptoContext);
  // const trigger = useContext(CryptoContext);
  const prevCount = usePrevious(cryptoContext.cryptoListContext);
  console.log("prevCount => ", prevCount);

  useEffect(() => {
    console.log("--- use effect ---");
    let cryptoList = [];
    let newList = [];

    async function retrieveDataFromDatabase() {
      try {
        cryptoList = await instance.get(`/cryptoList`);
        // UPDATE ALL PRICE HERE AND AFTER PUSH LIST IN CONTEXT
        newList.push(cryptoList.data);
        console.log("newList =>", newList)
        // await updateAllContextPriceFromList(newList);
        await updateAllContextPriceFromList(newList);

        // if (newList.length != prevCount.length) {
        //   console.log("different size");
        //   await updateAllContextPriceFromList(newList);
        // } else {
        //   for (var i = 0; i < newList.length; i++)
        //     if (newList[i] != prevCount[i]) {
        //       await updateAllContextPriceFromList(newList);
        //       return "False";
        //     } else {
        //       return "True";
        //     }
        // }

        // if (prevCount !== newList) {
        //   console.log("prev is different");
        //   await updateAllContextPriceFromList(newList);
        // }

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
  }, [cryptoContext.cryptoListContext]);

  async function updateAllContextPriceFromList(newList) {
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
    let newArray = cryptoContext.cryptoListContext;
    newArray = newArray.filter(function (item) {
      return item.id !== id;
    });
    // await setCryptos(newArray); TODO
    await deleteCryptoOnDatabase(id);
  }

  // Retrieve online crypto price
  async function retrieveCoinPrice() {
    let newList = [];

    async function updateStateWithNewList() {
      if (cryptoContext.cryptoListContext[0] !== undefined) {
        newList = cryptoContext.cryptoListContext[0];
        console.log("--- retrieveCoinPrice --- newList => ", newList);
        await udpateContextListPrice();
        console.log("--- retrieveCoinPrice / between --- ");

        // await cryptoContext.setCryptoListContext([]);
        // console.log(
        //   "--- retrieveCoinPrice --- cryptoContext.cryptoListContext[0] AFTER DELETE => ",
        //   cryptoContext.cryptoListContext[0]
        // );
        // console.log(
        //   "--- retrieveCoinPrice --- newList AFTER DELETE => ",
        //   newList
        // );
        // await cryptoContext.setCryptoListContext(newList);

        console.log(
          "--- retrieveCoinPrice / cryptoContext.cryptoListContext[0] --- => ",
          cryptoContext.cryptoListContext[0]
        );
      } else {
        retrieveCoinPrice();
        console.log("");
      }
    }

    const handleAsyncFunction = async () => {
      const firstResult = await updateStateWithNewList();
      console.log("--- handleAsyncFunction / between 1 --- ");
      //   const result = await cryptoContext.setCryptoListContext([]);
      //   console.log("--- handleAsyncFunction / between 2 --- ");
      //   const anotherResult = await cryptoContext.setCryptoListContext(newList);
      //   console.log("--- handleAsyncFunction / between 3 --- ");
    };

    handleAsyncFunction();

    async function udpateContextListPrice() {
      console.log("--- newList --- ==> ", newList);
      for (let i = 0; i < newList.length; i++) {
        let coin = newList[i].coin;
        let name = newList[i].name;
        let cryptoId = newList[i].id;
        let coinPrice = newList[i].actualPrice;

        // Create URL for request
        const coinCeckoFinalUrl =
          coinCeckoBaseUrl + name.toLowerCase() + coinCeckoBaseUrlEnd;

        // Axios Request
        const coinInformation = await axios
          .create({ baseURL: coinCeckoFinalUrl })
          .get();

        // Update coin data in local array
        newList[i].actualPrice = coinInformation.data[0].current_price;
        newList[i].marketCap = coinInformation.data[0].market_cap;
      }
      console.log("--- newList 2 --- ==> ", newList);
    }
  }

  // Retrieve new crypto from FLOATING BUTTON componant
  async function handleCallback(childData) {
    let newArray = cryptoContext.cryptoListContext[0];
    let newCoin = childData;
    newArray.push(childData);
    console.log("--- handleCallback --- newCoin ==> ", newCoin);
    await cryptoContext.setCryptoListContext(
      [...cryptoContext.cryptoListContext],
      childData
    );

    let newList = cryptoContext.cryptoListContext[0];

    async function udpateContextListPrice() {
      console.log(
        "--- handleCallback / udpateContextListPrice / newList --- ==> ",
        newList
      );
      for (let i = 0; i < newList.length; i++) {
        let coin = newList[i].coin;
        let name = newList[i].name;
        let cryptoId = newList[i].id;
        // let coinPrice = newList[i].actualPrice;
        let type = newList[i].type;
        let descritpion = newList[i].descruiption;
        let marketCap = newList[i].marketCap;

        // Create URL for request
        const coinCeckoFinalUrl =
          coinCeckoBaseUrl + name.toLowerCase() + coinCeckoBaseUrlEnd;

        // Axios Request
        const coinInformation = await axios
          .create({ baseURL: coinCeckoFinalUrl })
          .get();

        newList[i].actualPrice = coinInformation.data[0].current_price;
        newList[i].marketCap = coinInformation.data[0].market_cap;
        console.log("--- newList[i].actualPrice", newList[i].name);
        console.log("--- newList[i].actualPrice", newList[i].actualPrice);

        // If coin have not price (becauce it's just added) we put coin on database with price
        if (newList[i].id === undefined || newList[i].id === null) {
          console.log("in no price");
          let coinPrice = newList[i].actualPrice.toString();
          console.log("funcking price ==> ", coinPrice);
          const newCoin = {
            name,
            coin,
            coinPrice,
            type,
            descritpion,
            marketCap
          };
          await instance.post(`/cryptolist/newCrypto`, {
            newCoin
          });
        }
      }

      // TODO
      await cryptoContext.setCryptoListContext(
        [...cryptoContext.cryptoListContext],
        newList
      );
      console.log("--- newList 2 --- ==> ", newList);
    }

    // fetchData();
    udpateContextListPrice();
    // setTimeout(fetcData2, 200);
    // // setTimeout(retrieveCoinPrice, 1000);
    // console.log("--- END OF handleCallback ---");
  }

  try {
    console.log("--- in render if ---", cryptoContext.cryptoListContext[0]);

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
    // cryptoContext.setCryptoListContext();
    return "loading ...";
  }
};

export default CryptoTable;

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

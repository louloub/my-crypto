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

  // All crypto list
  const [cryptoList, setCryptoList] = useState([])
  const [updateDatabase, setUpdateDatabase] = useState(true)

  // Used when create new crypto
  // const [newCrypto, setNewCrypto] = useState()

  // const [cryptoToDelete, setCryptoToDelete] = useState()

  // const [isDeleteMode, setIsDeleteMode] = useState(false)

  // Set cryptoList with DB when cryptoList is modified
  useEffect(() => {

    async function retrieveDataFromDatabase() {

      try {
        console.log("use effet cryptoList => ", cryptoList)

        const retrieveList = await instance.get(`/cryptoList`);

        if (updateDatabase) {
          setCryptoList(retrieveList.data)
          setUpdateDatabase(false)
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

  }, [updateDatabase, cryptoList]);

  /**
   * Delete crypto
   * @param crypto : crypto to delete
   */
  async function deleteCoin(crypto) {
    // let newArray = [...cryptoList];
    // newArray = newArray.filter(function (item) {
    //   return item.id !== id;
    // });
    console.log("crypto.id => ", crypto.id)
    await deleteCryptoOnDatabase(crypto.id);
    setUpdateDatabase(true)
    // setCryptoToDelete(crypto)
    // setIsDeleteMode(true)
    // setCryptoList(newArray)
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

        if (coinInformation.data[0]) {
          // Update coin data
          crytpo.actualPrice = await coinInformation.data[0].current_price;
          crytpo.marketCap = await coinInformation.data[0].market_cap;
        } else {
          crytpo.actualPrice = "no price"
          crytpo.marketCap = "no market cap"
        }
        setUpdateDatabase(true)

        await instance.post(`/updateCrypto`, {
          id: crytpo.id,
          actualPrice: crytpo.actualPrice,
          marketCap: crytpo.marketCap
        });

        setUpdateDatabase(true)

      })

      // setCryptoList(newList)

    }

    setUpdateDatabase(true)

  }

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

    console.log("callback, childData => ", childData)

    setUpdateDatabase(true)

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

// async function saveNewDataOnDatabse() {
//   // const handleAsyncFunction = async () => {
//   //   do {
//   //     let cryptoArrayFromContext = await cryptoContext.cryptoListContext[0];
//   //     for (let i = 0; i < cryptoArrayFromContext.length; i++) {
//   //       console.log(cryptoArrayFromContext[i].actualPrice);
//   //       await instance.post(`/cryptoListPrice`, {
//   //         id: cryptoArrayFromContext[i].id,
//   //         actualPrice: cryptoArrayFromContext[i].actualPrice,
//   //         marketCap: cryptoArrayFromContext[i].marketCap
//   //       });
//   //     }
//   //   } while (cryptoContext.cryptoListContext[0] === undefined);
//   //   //   if (cryptoContext.cryptoListContext[0] !== undefined) {
//   //   //     await saveOnDatabase();
//   //   //   } else {
//   //   //     handleAsyncFunction();
//   //   //   }
//   // };
//   // handleAsyncFunction();
// }

// async function updateAllAcutalPriceInDatabase(coinName, coinPrice, cryptoId) {
//   try {
//     console.log(
//       "--- updateAllAcutalPriceInDatabase --- cryptoId => ",
//       cryptoId
//     );
//     console.log(
//       "--- updateAllAcutalPriceInDatabase --- coinName => ",
//       coinName
//     );
//     console.log(
//       "--- updateAllAcutalPriceInDatabase --- coinPrice => ",
//       coinPrice
//     );

//     // Update all crypto price, retrieve new list and set state with it
//     const cryptoList = await instance.post(`/cryptoListPrice`, {
//       id: cryptoId,
//       actualPrice: coinPrice
//     });
//     // rconsole.log("--- updateAllAcutalPriceInDatabase --- cryptoList => ", cryptoList);
//     const newList = await instance.get(`/cryptolist`);
//     setTimeout(
//       console.log(
//         "--- updateAllAcutalPriceInDatabase --- cryptoList2 => ",
//         newList
//       ),
//       100
//     );

//     // cryptoContext.setCryptoListContext(newList);
//     // setCryptos(newList.data);
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function updateAllAcutalMarketCapInDatabase(
//   coinName,
//   coinMarketCap,
//   cryptoId
// ) {
//   try {
//     console.log(
//       "--- updateAllAcutalMarketCapInDatabase --- cryptoId ==> ",
//       cryptoId
//     );
//     // Update all crypto price, retrieve new list and set state with it
//     const cryptoList = await instance.post(`/cryptoListMarketCap`, {
//       id: cryptoId,
//       marketCap: coinMarketCap
//     });
//     const newList = await instance.get(`/cryptoList`);
//   } catch (err) { }
// }
import React, { useEffect, useContext } from "react";
import { Table } from "reactstrap";
import axios from "axios";

import CryptoContext from "../context/CryptoContext";
let coinCeckoBaseUrl = "https://api.coingecko.com/api/v3/simple/price?ids=";

const CryptoTable = props => {
  const crypto = useContext(CryptoContext);
  console.log(crypto);
  console.log(crypto.list)

//   for (let i = 0; i < crypto.list.length; i++) {
//     // crypto.setList(crypto.list.push(cryptoList.data[i]));
//     console.log(crypto.list[i]);
//   }
  return "rien";
  //   const list = useContext(CryptoContext);
  //   console.log(list)
  //   const setCrypto = useContext(CryptoContext);

  //   async function retrieveCoinPrice() {
  //     list.map(async crypto => {
  //       let coinPrice = "";
  //       const coinName = crypto.name.toLowerCase();
  //       const coinCeckoFinalUrl =
  //         coinCeckoBaseUrl + coinName + "&vs_currencies=USD";
  //       try {
  //         console.log(coinCeckoFinalUrl);
  //         const coinInformation = await axios
  //           .create({ baseURL: coinCeckoFinalUrl })
  //           .get();

  //         switch (coinName) {
  //           case "bitcoin":
  //             coinPrice = coinInformation.data.bitcoin.usd;
  //             setCrypto(crypto.actualPrice = coinPrice)
  //             console.log(coinPrice);
  //             break;
  //           case "ethereum":
  //             coinPrice = coinInformation.data.ethereum.usd;
  //             console.log(coinPrice);
  //             break;
  //           case "litecoin":
  //             coinPrice = coinInformation.data.litecoin.usd;
  //             console.log(coinPrice);
  //             break;
  //         }
  //         for (const property in crypto){
  //             console.log(`${property}`)
  //         }
  //         // setCrypto()
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     });
  //   }

  //   useEffect(async () => {
  //     try {
  //       retrieveCoinPrice();
  //     } catch (err) {}
  //   }, []);

  //   if (list != undefined) {
  //     return (
  //       <Table responsive>
  //         <thead>
  //           <tr>
  //             <th>Name</th>
  //             <th>Coin</th>
  //             <th>Actual Price</th>
  //             <th>Type</th>
  //             <th>Market cap</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {list.map(crypto => {
  //             return (
  //               <tr>
  //                 <td>{crypto.name}</td>
  //                 <td>{crypto.coin}</td>
  //                 <td>Actual price</td>
  //                 <td>{crypto.type}</td>
  //                 <td>Market cap</td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </Table>
  //     );
  //   } else {
  //     return "no coin actually";
  //   }
};

export default CryptoTable;

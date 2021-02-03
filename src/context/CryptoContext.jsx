import { createContext } from "react";

const CryptoContext = createContext({
  cryptos: [],
  setCrypto: () => {},
});

export default CryptoContext;
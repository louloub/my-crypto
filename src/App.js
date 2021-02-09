import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// MY COMPONENT
import Navbar from "./components/Navbar";
import CryptoList from "./components/CryptoList";
import Profil from "./components/Profil";
import { CryptoProvider } from "./context/CryptoContext";

function App() {
  return (
    <div className="App">
      <CryptoProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={CryptoList}></Route>
            <Route exact path="/profil" component={Profil}></Route>
          </Switch>
        </Router>
      </CryptoProvider>
    </div>
  );
}

export default App;

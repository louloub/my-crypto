import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// MY COMPONENT
import Navbar from "./components/Navbar";
import CryptoList from "./components/CryptoList";
import Profil from "./components/Profil";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={CryptoList}></Route>
          <Route exact path="/profil" component={Profil}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

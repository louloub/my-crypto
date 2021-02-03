import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// MY COMPONENT
import Navbar from "./components/Navbar";
import FloatingButton from "./components/FloatingButton";
import CryptoList from "./components/CryptoList";
import Profil from "./components/Profil";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <FloatingButton />
        <Switch>
          <Route exact path="/" component={CryptoList}></Route>
          <Route exact path="/profil" component={Profil}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

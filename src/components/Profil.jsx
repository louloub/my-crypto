import React, { Component } from "react";
import {
  Jumbotron,
  Container,
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody
} from "reactstrap";

const Profil = () => {
  const openTabsFromLink = newPageUrl => {
    window.open(newPageUrl, "_blank");
  };

  const BinanceBalance = () => {
    const crypto = require("crypto");
    const query_string = "timestamp=1578963600000";
    const apiSecret =
      "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A";

    function signature(query_string) {
      return crypto
        .createHmac("sha256", apiSecret)
        .update(query_string)
        .digest("hex");
    }

    console.log("hashing the string: ");
    console.log(query_string);
    console.log("and return:");
    console.log(signature(query_string));

    console.log("\n");
    var brul = "https://api.binance.com";
    var endPoint = "/api/v3/account";
    var signature = signature(query_string);
    var ourRequest = new XMLHttpRequest();
    var url = brul + endPoint + "?" + signature;
    ourRequest.open("GET", url, true);
    ourRequest.setRequestHeader("X-MBX-APIKEY",signature);

    ourRequest.onload = function() {
      let ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
    };
    ourRequest.send();

    // var brul = 'https://api.binance.com';
    // var endPoint = '/api/v3/account';
    // var dataQueryString = 'recvWindow=60000&timestamp=' +Date.now();
    // var binancekey = 'boDPTh2Rp4IryiuISqsT9pB9yOut13MtEI6QUpZgu16ZC0pDrR8Pl9nEDtYVH1BR'
    // var binancekeys = 'F2RZ0YIeOHotfduwCWxXPJ1dyqF9rZrkuPm0ww2G7rrCVWxkB8wh6sc1pU2NA5Ls'
    // var keys = {
    //   'akey' : binancekey,
    //   'skey' : binancekeys
    // }
    // var signature = hmacSHA512(dataQueryString,keys['skey']).toString(Base64);
    // console.log("dataQueryString => " ,dataQueryString)
    // console.log("signature => " ,signature)
    // var ourRequest = new XMLHttpRequest();
    // var url = brul + endPoint + '?' + dataQueryString + '&signature=' +signature;

    // ourRequest.open('GET', url, true);
    // ourRequest.setRequestHeader('X-MBX-APIKEY', keys['akey']);
    // ourRequest.onload = function(){
    //   let ourData = JSON.parse(ourRequest.responseText);
    //   console.log(ourData)
    // }
    // ourRequest.send();

    console.log();
    return <p>biance </p>;
  };

  return (
    <div>
      <Jumbotron fluid>
        <Container fluid>
          <h1 className="display-3">My accout</h1>
          <p className="lead">
            My favorite articles, social media link and exchange balance.
          </p>
        </Container>
      </Jumbotron>
      <p>my balance = {BinanceBalance()}</p>
      <CardGroup>
        <Card>
          <CardImg
            top
            width="100%"
            src="https://cryptoglobe.s3.eu-west-2.amazonaws.com/2021/01/shiba-inu-3087207_1280.jpg"
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle tag="h5">
              BitMEX to Add Dogecoin Perpetual Contracts After Retail Investors
              Take DOGE to New All-Time High
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              {/* Card subtitle */}
            </CardSubtitle>
            <CardText>
              Cryptocurrency derivatives trading platform BitMEX has announced
              it’s launching Dogecoin (DOGE) perpetual swap contracts, allowing
              traders and investors to speculate on the price of the
              cryptocurrency.
            </CardText>
            <Button color="primary">Read</Button>
          </CardBody>
        </Card>
        <Card>
          <CardImg
            top
            width="100%"
            src="https://image.blockchain.news/features/8C35D96C1CA2030FD859D5B87844015AF2654A7F8BEA1388BE39E42C1362AB20.jpg"
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle tag="h5">
              NYDIG Expects to Hold $25 Billion In Bitcoin for Institutions by
              End of 2021
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              {/* Card subtitle */}
            </CardSubtitle>
            <CardText>
              Ross Stevens, the founder and CEO of New York Digital Investment
              Group (NYDIG) has predicted that the firm could significantly
              increase the amount of Bitcoin it holds under management by the
              end of this year to $25 Billion in BTC.
            </CardText>
            <Button color="primary">Read</Button>
          </CardBody>
        </Card>
        <Card>
          <CardImg
            top
            width="100%"
            src="https://www.tbstat.com/wp/uploads/2020/05/20200526_Polkadot-Daily.png"
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle tag="h5">
              Crypto asset manager 21Shares is launching an exchange-traded
              product for Polkadot's token
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Card subtitle
            </CardSubtitle>
            <CardText>
              Cryptocurrency asset manager 21Shares, formerly known as Amun, is
              launching a Polkadot exchange-traded product (ETP).
            </CardText>
            <Button color="primary">Read</Button>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
};

export default Profil;

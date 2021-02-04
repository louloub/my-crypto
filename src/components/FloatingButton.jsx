import React, { Component, useState, useContext } from "react";
import {
  Container,
  MyFloatingButton,
  Link
} from "react-floating-action-button";
import AddCrypto from "../components/AddCrypto";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup
} from "reactstrap";
import CryptoTable from "./CryptoTable";
import axios from "axios";
import { CryptoContext } from "../context/CryptoContext"

const instance = axios.create({ baseURL: "http://localhost:5000/" });

const FloatingButton = () => {
  const crypto = useContext(CryptoContext)
  const [modal, setModal] = useState(false);
  const [unmountOnClose, setUnmountOnClose] = useState(false);
  const [newCoin, setNewCoin] = useState({
    name: "",
    coin: "",
    type: "",
    description: ""
  });
  const toggle = () => setModal(!modal);

  const validateAddCoin = e => {
    console.log(newCoin);
    setModal(!modal);
    setNewCoin({ name: "", coin: "", type: "", description: "" });
    addCryptoOnDatabase()
  };

  async function addCryptoOnDatabase() {
    try {
      // Add crypto in database
      const cryptoList = await instance.post(`/cryptolist/newCrypto`, {
        newCoin
      });
    } catch (err) {}
  }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewCoin({ ...newCoin, [name]: value });
  };

  return (
    <Container>
      <Button color="success" onClick={toggle}>
        Add crypto
      </Button>
      <Modal isOpen={modal} toggle={toggle} unmountOnClose={unmountOnClose}>
        <ModalHeader toggle={toggle}>Add crypto to dahsboard </ModalHeader>
        <ModalBody>
          Name :
          <Input
            name="name"
            onChange={handleInputChange}
            value={newCoin.name}
            type="textarea"
            placeholder="Write coin name "
            rows={1}
          />
          Coin :
          <Input
            name="coin"
            onChange={handleInputChange}
            value={newCoin.coin}
            type="textarea"
            placeholder="Write coin slug"
            rows={1}
          />
          Type :
          <Input
            name="type"
            onChange={handleInputChange}
            value={newCoin.type}
            type="textarea"
            placeholder="Write coin type"
            rows={1}
          />
          Description :
          <Input
            name="description"
            onChange={handleInputChange}
            value={newCoin.description}
            type="textarea"
            placeholder="Write coin description"
            rows={1}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={validateAddCoin}>
            Validate
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FloatingButton;

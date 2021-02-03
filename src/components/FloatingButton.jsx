import React, { Component, useState } from "react";
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
import CryptoTable from "./CryptoTable"

const FloatingButton = () => {
  const [modal, setModal] = useState(false);
  const [unmountOnClose, setUnmountOnClose] = useState(true);
  const [newCoin, setNewCoin] = useState({name: "", coin: "", type: "", description: ""})
  const toggle = () => setModal(!modal);

  const validateAddCoin = (e) => {
    console.log(e.target)
  }

  return (
    <Container>
      <Button color="success" onClick={toggle}>
        Add crypto
      </Button>
      <Modal isOpen={modal} toggle={toggle} unmountOnClose={unmountOnClose}>
        <ModalHeader toggle={toggle}>Add crypto to dahsboard </ModalHeader>
        <ModalBody>
          Name :
          <Input type="textarea" placeholder="Write coin name " rows={1} />
          Coin :
          <Input type="textarea" placeholder="Write coin slug" rows={1} />
          Type :
          <Input type="textarea" placeholder="Write coin type" rows={1} />
          Description :
          <Input
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

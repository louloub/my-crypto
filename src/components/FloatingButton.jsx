import React, { Component } from "react";
import { Container, Button, Link } from "react-floating-action-button";

const FloatingButton = () => {
  return (
    <Container>
      {/* <Link href="#" tooltip="Create note link" icon="far fa-sticky-note" /> */}
      <Link href="#" tooltip="Add crypto" icon="fas fa-user-plus" />
      <Button
        tooltip="The big plus button!"
        icon="fas fa-plus"
        rotate={true}
        onClick={() => alert("FAB Rocks!")}
      />
    </Container>
  );
};

export default FloatingButton;

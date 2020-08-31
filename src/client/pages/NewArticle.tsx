import React from "react";
import Header from "../components/Header";
import REditor from "../components/REditor";
import { Container } from "@material-ui/core";

export default function NewArticle() {

  return (
    <div id={"newArticle"}>
      <Header/>
      <Container maxWidth={"lg"}>
        <div id="editor">
          <REditor/>
        </div>
      </Container>
    </div>
  );
}
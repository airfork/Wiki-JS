import React, { useState } from "react";
import Header from "../components/Header";
import REditor from "../components/REditor";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

export default function NewArticle() {
  // const useStyles = makeStyles((theme: Theme) =>
  //   createStyles({
  //     :
  //   }),
  // );

  const [preview, setPreview] = useState(false);

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
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

export default function Search() {

  return (
    <>
      <Header title={"Search"} searchIcon={false} />
      <SearchBar />
    </>
  )
}
import React from 'react';
import SearchBar from 'material-ui-search-bar';
import SearchIcon from '@material-ui/icons/Search';

type WikiSearchProps = {
  mainClass?: string;
  inputClass?: string;
  iconButtonClass?: string;
}

export default function WikiSearch(props: WikiSearchProps) {
  return (
    <SearchBar classes={{
      root: props.mainClass,
      input: props.inputClass,
      iconButton: props.iconButtonClass,
    }} />
  )
}
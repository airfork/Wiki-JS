import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  input: {
    height: 40
  },
});

export default function SearchBarButton() {
  const searchButton = (
    <IconButton>
      <SearchIcon />
    </IconButton>
  );

  const classes = useStyles();
  const [iconRendered, setIconRendered] = useState(true);

  const handleSubmitEvent = (event) => {
    event.preventDefault();
  }

  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }

  return (
    <section onClick={() => setIconRendered(!iconRendered)}>
      {!iconRendered
        ? <TextField
          variant="outlined"
          margin="dense"
          size="small"
          required
          fullWidth
          id="search"
          label="Search"
          value={search}
          onInput={handleSearchChange}
          autoFocus
          InputProps={{
            style: {
              height: '1.75em'
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        : <IconButton>
          <SearchIcon />
        </IconButton>
      }
    </section>
  );

}

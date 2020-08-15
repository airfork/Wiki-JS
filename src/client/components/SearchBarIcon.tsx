import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

export default function SearchBarButton() {
  const searchButton = (
    <IconButton>
      <SearchIcon />
    </IconButton>
  );

  const [iconRendered, setIconRendered] = useState(false);

  const handleSubmitEvent = (event) => {
    event.preventDefault();
  }

  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }

  return (
    <section onClick={() => setIconRendered(!iconRendered)}>
      {iconRendered
        ? <TextField
          variant="outlined"
          margin="dense"
          required
          fullWidth
          id="search"
          label="Search"
          value={search}
          onInput={handleSearchChange}
          autoFocus
        />
        : <IconButton>
          <SearchIcon />
        </IconButton>
      }
    </section>
  );

}

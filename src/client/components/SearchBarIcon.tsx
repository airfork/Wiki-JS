import React, {useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";

export default function SearchBarButton () {
  const searchButton = (
    <IconButton>
      <SearchIcon />
    </IconButton>
  );

  const [renderedComponent, setRenderedComponent] = useState(searchButton);
  const [iconRendered, setIconRendered] = useState(true)

  const handleSubmitEvent = (event) => {
    console.log(`Search: ${search}`)
    event.preventDefault();
  }

  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  }

  const swapComponent = () => {
    if (iconRendered) {
      setRenderedComponent(
        <TextField
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
      );
      setIconRendered(false);
      return
    }

    setRenderedComponent(searchButton);
    setIconRendered(true);
  }

  return (
    <section onClick={swapComponent}>
      {renderedComponent}
    </section>
  );

}

import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { gql, useQuery } from '@apollo/client';
import { searchQuery, searchQueryVariables } from '../graphql/searchQuery';
import TextField from '@material-ui/core/TextField';

type WikiSearchProps = {
  mainClass?: string;
  inputClass?: string;
}

const SEARCH_QUERY = gql`
  query searchQuery($titleIncludes: String) {
    getFilteredPages(pageFilter: {
      titleIncludes: $titleIncludes
    }) {
      inTitle {
        title
      }
      inContent {
        title
      }
    }
  }
`;

export default function WikiSearch(props: WikiSearchProps) {
  const [searchVal, setSearchVal] = useState('');
  const { data } = useQuery<searchQuery, searchQueryVariables>(SEARCH_QUERY, {
    variables: {
      titleIncludes: searchVal,
    },
    skip: searchVal === ''
  });

  return (
    <Autocomplete
      className={props.mainClass}
      options={data?.getFilteredPages.inTitle.map(page => page.title) ?? []}
      renderInput={params =>
        <TextField
          {...params}
          className={props.inputClass}
          margin="normal"
          variant="outlined"
          placeholder="Search"
        />
      }
      onInputChange={(_, value) => setSearchVal(value)}
    />
  )
}
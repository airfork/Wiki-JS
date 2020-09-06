import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import { gql, useQuery } from '@apollo/client';
import { searchQuery, searchQueryVariables } from '../graphql/searchQuery';
import { useEffect } from 'react';

type WikiSearchProps = {
  mainClass?: string;
  inputClass?: string;
  iconButtonClass?: string;
}

const SEARCH_QUERY = gql`
  query searchQuery($titleIncludes: String) {
    getPages(pageFilter: {
      titleIncludes: $titleIncludes
    }) {
      title
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
  useEffect(() => {
    console.log(data);
  }, [data])
  return (
    <SearchBar
      classes={{
        root: props.mainClass,
        input: props.inputClass,
        iconButton: props.iconButtonClass,
      }}
      onChange={newValue => setSearchVal(newValue)}
    />
  )
}
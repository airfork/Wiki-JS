import React, { useEffect, useMemo, useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { gql, useQuery } from '@apollo/client';
import { searchQuery, searchQueryVariables } from '../graphql/searchQuery';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router';
import Routes from '../routes';

type WikiSearchProps = {
  mainClass?: string;
  searchSize?: 'dense' | 'none' | 'normal';
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
  const [randomKey, setRandomKey] = useState(Math.random());
  const { data } = useQuery<searchQuery, searchQueryVariables>(SEARCH_QUERY, {
    variables: {
      titleIncludes: searchVal,
    },
    skip: searchVal === ''
  });
  const history = useHistory();
  const { inContentTitles, inTitleTitles, allTitles } = useMemo(() => {
    const inTitleTitles = data?.getFilteredPages.inTitle.map(page => page.title) ?? [];
    const inContentTitles = data?.getFilteredPages.inContent.map(page => page.title) ?? [];
    return { inTitleTitles, inContentTitles, allTitles: [...inTitleTitles, ...inContentTitles] };
  }, [data]);
  useEffect(() => {
    console.log(allTitles);
  }, [allTitles]);
  const orderFunction = (option: string) => {
    if (inTitleTitles.includes(option)) {
      return 'Title';
    }
    if (inContentTitles.includes(option)) {
      return 'Content';
    }
    return 'Tags';
  }


  return (
    <Autocomplete
      key={randomKey}
      options={allTitles}
      renderInput={params =>
        <TextField
          {...params}
          className={props.mainClass}
          margin={props.searchSize}
          variant="outlined"
          placeholder="Search"
        />
      }
      groupBy={orderFunction}
      onInputChange={(_, value) => setSearchVal(value)}
      onChange={(_, value) => {
        if (value != null) {
          history.push(`${Routes.wiki.path}/${value}`);
        }
      }}
      onClose={() => {
        setRandomKey(Math.random());
      }}
      noOptionsText="No pages found"
    />
  )
}
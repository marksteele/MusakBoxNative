/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../state/GlobalState';
import SearchResults from '../components/SearchResults';
import Fuse from 'fuse.js';
import {TextInput} from 'react-native';

const SearchScreen = ({navigation}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [{search, songList}, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (
      search !== {} &&
      (search.term !== undefined || search.artist !== undefined)
    ) {
      if (search.type === 'artist') {
        setSearchResults(songList.filter((x) => x.artist === search.artist));
      } else {
        const options = {
          minMatchCharLength: 2,
          threshold: 0.1,
          distance: 100,
          isCaseSensitive: false,
          keys: ['title', 'artist'],
        };
        const fuse = new Fuse(songList, options);
        const res = fuse.search(search.term).map((i) => i.item);
        setSearchResults(res);
      }
    }
  }, [search]);
  return (
    <>
      <TextInput
        autoCapitalize="none"
        style={{
          borderColor: '#000000',
          borderBottomWidth: 1,
        }}
        onChangeText={(text) =>
          dispatch({
            type: 'setSearch',
            search: {type: 'search', term: text},
          })
        }
      />
      <SearchResults results={searchResults} />
    </>
  );
};

export default SearchScreen;

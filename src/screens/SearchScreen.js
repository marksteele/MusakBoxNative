/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../state/GlobalState';
import Fuse from 'fuse.js';
import {Text, TextInput, View, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  searchBoxContainer: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  input: {
    flex: 9,
    borderColor: '#000000',
    borderWidth: 2,
    fontSize: 25,
  },
  searchResultsContainer: {
    flexDirection: 'column',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  item: {
    padding: 10,
    height: 44,
    width: '90%',
  },
  button: {
    fontSize: 25,
    textAlignVertical: 'bottom',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
});
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
          keys: ['title'],
        };
        const fuse = new Fuse(songList, options);
        const res = fuse.search(search.term).map((i) => i.item);
        setSearchResults(res);
      }
    }
  }, [search]);

  const addToQueue = (song) => {
    dispatch({type: 'setAddToQueue', song: song});
  };

  return (
    <View>
      <View style={styles.searchBoxContainer}>
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(text) =>
            dispatch({
              type: 'setSearch',
              search: {type: 'search', term: text},
            })
          }
        />
        <Icon name="search" size={30} />
      </View>
      <View style={styles.searchResultsContainer}>
        <FlatList
          data={searchResults}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.item}>{`${item.title}`}</Text>
              <Icon
                style={styles.button}
                name="playlist-add"
                size={20}
                onPress={() => addToQueue(item)}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

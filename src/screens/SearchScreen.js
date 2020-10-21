/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../state/GlobalState';
import Fuse from 'fuse.js';
import {Text, TextInput, View, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '../Styles';

const styles = Styles();

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
        <Icon name="search" style={styles.icon} size={30} />
      </View>
      <FlatList
        data={searchResults}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 9}}>
              <Text
                style={{
                  ...styles.item,
                  ...styles.primaryTextSmall,
                }}>{`${item.title}`}</Text>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Icon
                style={styles.icon}
                name="playlist-add"
                size={25}
                onPress={() => addToQueue(item)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default SearchScreen;

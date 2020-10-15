import {FlatList, StyleSheet, Text, View, Button} from 'react-native';
import React, {useContext} from 'react';
import {GlobalContext} from '../state/GlobalState';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const ArtistList = (props) => {
  const [{}, dispatch] = useContext(GlobalContext);
  const navigation = useNavigation();

  const doSearch = (artist) => {
    navigation.navigate('Search');
    dispatch({type: 'setSearch', search: {type: 'artist', artist: artist}});
  };

  if (props.artists === []) {
    return <Text style={styles.item}>Nothing to see here... yet?</Text>;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={props.artists}
          renderItem={({item}) => (
            <Button title={item.artist} onPress={() => doSearch(item.artist)} />
          )}
        />
      </View>
    );
  }
};

export default ArtistList;

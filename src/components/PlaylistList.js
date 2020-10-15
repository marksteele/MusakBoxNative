import {FlatList, StyleSheet, Text, View, Button} from 'react-native';
import React, {useContext} from 'react';
import {GlobalContext} from '../state/GlobalState';
import {useNavigation} from '@react-navigation/native';
import {loadPlaylist} from '../util/playlists';

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

const PlaylistList = (props) => {
  const [{}, dispatch] = useContext(GlobalContext);
  const navigation = useNavigation();

  const load = (playlist) => {
    loadPlaylist(playlist).then((songs) => {
      console.log("SENDING PLAYLIST DATA");
      dispatch({type: 'setQueue', queue: songs});
      navigation.navigate('Home');
    });
  };

  if (props.artists === []) {
    return <Text style={styles.item}>Nothing to see here... yet?</Text>;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={props.playlists}
          renderItem={({item}) => (
            <Button title={item.id} onPress={() => load(item.id)} />
          )}
        />
      </View>
    );
  }
};

export default PlaylistList;

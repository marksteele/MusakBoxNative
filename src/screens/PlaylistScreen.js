import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import {loadPlaylist} from '../util/playlists';
import {FlatList, View, Text} from 'react-native';
import Styles from '../Styles';

const styles = Styles();

const PlaylistScreen = ({navigation}) => {
  const [{}, dispatch] = useContext(GlobalContext);

  const load = (playlist) => {
    loadPlaylist(playlist).then((songs) => {
      dispatch({type: 'setQueue', queue: songs});
      navigation.navigate('Home');
    });
  };

  const [{playlists}] = useContext(GlobalContext);
  return (
    <FlatList
      data={playlists.map((x) => {
        return {id: x};
      })}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({item}) => (
        <Text
          style={{...styles.item, ...styles.primaryText}}
          onPress={() => load(item.id)}>
          {item.id}
        </Text>
      )}
    />
  );
};

export default PlaylistScreen;

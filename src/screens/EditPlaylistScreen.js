import {GlobalContext} from '../state/GlobalState';
import React, {useContext, useState} from 'react';
import {TextInput, Text, FlatList, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {savePlaylist, removePlaylist} from '../util/playlists';
import Styles from '../Styles';

const styles = Styles();

const EditPlaylistScreen = ({navigation}) => {
  const [{playlists, queue}, dispatch] = useContext(GlobalContext);
  const [selected, setSelected] = useState('');

  const save = async (playlist) => {
    if (selected === '') {
      alert('You must specify a playlist');
      return;
    }
    dispatch({type: 'setLoading', loading: true});
    await savePlaylist(selected, queue);
    dispatch({type: 'setRefresh', refresh: true});
  };

  const remove = async (playlist) => {
    if (selected === '') {
      alert('You must specify a playlist');
      return;
    }
    dispatch({type: 'setLoading', loading: true});
    await removePlaylist(selected);
    dispatch({type: 'setRefresh', refresh: true});
  };

  return (
    <View style={styles.top}>
      <View style={styles.searchBoxContainer}>
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          value={selected}
          onChangeText={(text) => setSelected(text)}
        />
        <MaterialIcon name="save" size={30} onPress={() => save()} />
        <MaterialIcon name="delete" size={30} onPress={() => remove()} />
      </View>
      <FlatList
        style={styles.searchResultsContainer}
        data={playlists.map((x) => {
          return {id: x};
        })}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text
              style={styles.primaryTextSmall}
              onPress={() => setSelected(item.id)}>{`${item.id}`}</Text>
          </View>
        )}
      />
      <View style={styles.separator} />
    </View>
  );
};

export default EditPlaylistScreen;

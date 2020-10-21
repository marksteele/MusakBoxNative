import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import {FlatList, Text, View} from 'react-native';
import Styles from '../Styles';

const styles = Styles();
const ArtistScreen = ({navigation}) => {
  const [{artists}] = useContext(GlobalContext);
  const [{}, dispatch] = useContext(GlobalContext);

  const doSearch = (artist) => {
    navigation.navigate('Search');
    dispatch({type: 'setSearch', search: {type: 'artist', artist: artist}});
  };

  return (
    <View>
      <FlatList
        data={artists.map((x) => {
          return {key: x};
        })}
        ItemSeparatorComponent={() => <View style={{...styles.separator}} />}
        renderItem={({item}) => (
          <Text
            style={{...styles.item, ...styles.primaryText}}
            onPress={() => doSearch(item.key)}>
            {item.key}
          </Text>
        )}
      />
      <Text>Hello</Text>
    </View>
  );
};

export default ArtistScreen;

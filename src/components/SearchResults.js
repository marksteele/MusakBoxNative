import {FlatList, StyleSheet, Text, View, Button} from 'react-native';
import React, {useContext} from 'react';
import {GlobalContext} from '../state/GlobalState';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
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

const SearchResults = (props) => {
  const [{}, dispatch] = useContext(GlobalContext);

  const addToQueue = (song) => {
    dispatch({type: 'setAddToQueue', song: song});
  };

  if (props.results === []) {
    return <Text style={styles.item}>Nothing to see here... yet?</Text>;
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          data={props.results}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text
                style={styles.item}>{`${item.title} by ${item.artist}`}</Text>
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
    );
  }
};

export default SearchResults;

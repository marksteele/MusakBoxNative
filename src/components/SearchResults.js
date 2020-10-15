import {FlatList, StyleSheet, Text, View, Button} from 'react-native';
import React, {useContext} from 'react';
import {GlobalContext} from '../state/GlobalState';

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
          renderItem={({item}) => (
            <Button style={styles.item} title={`${item.title} by ${item.artist}`} onPress={() => addToQueue(item)} />
          )}
        />
      </View>
    );
  }
};

export default SearchResults;

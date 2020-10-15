import {StyleSheet, View, Button} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
});

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button title="Artists" onPress={() => navigation.navigate('Artists')} />
      <Button title="Search" onPress={() => navigation.navigate('Search')} />
      <Button
        title="Playlists"
        onPress={() => navigation.navigate('Playlists')}
      />
    </View>
  );
};

export default HomeScreen;

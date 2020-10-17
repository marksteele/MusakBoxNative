import {StyleSheet, View, Button} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Icon
        name="brush"
        size={40}
        onPress={() => navigation.navigate('Artists')}
      />
      <MaterialIcon
        name="search"
        size={40}
        onPress={() => navigation.navigate('Search')}
      />
      <Icon
        name="playlist-music"
        size={40}
        onPress={() => navigation.navigate('Playlists')}
      />
      <MaterialIcon
        name="settings"
        size={40}
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

export default HomeScreen;

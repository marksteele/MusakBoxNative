import {View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Styles from '../Styles';

const styles = Styles();

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Icon
        style={styles.icon}
        name="brush"
        size={40}
        onPress={() => navigation.navigate('Artists')}
      />
      <MaterialIcon
        style={styles.icon}
        name="search"
        size={40}
        onPress={() => navigation.navigate('Search')}
      />
      <Icon
        style={styles.icon}
        name="playlist-music"
        size={40}
        onPress={() => navigation.navigate('Playlists')}
      />
      <MaterialIcon
        style={styles.icon}
        name="settings"
        size={40}
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

export default HomeScreen;

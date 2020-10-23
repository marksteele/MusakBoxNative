import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Styles from '../Styles';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../state/GlobalState';
import Player from '../components/Player';

const styles = Styles();

const HomeScreen = ({navigation}) => {
  const [{songList}, dispatch] = useContext(GlobalContext);

  const randomPlaylist = () => {
    dispatch({
      type: 'setQueue',
      queue: songList.sort(() => 0.5 - Math.random()).slice(0, 50),
    });
  };

  return (
    <View style={{flexGrow: 1}}>
      <View style={{...styles.itemContainer, justifyContent: 'space-evenly', alignContent: '', alignItems: 'center'}}>
        <FontAwesome
          style={styles.icon}
          name="magic"
          size={38}
          onPress={() => randomPlaylist()}
        />
        <Icon
          style={styles.icon}
          name="brush"
          size={38}
          onPress={() => navigation.navigate('Artists')}
        />
        <MaterialIcon
          style={styles.icon}
          name="search"
          size={38}
          onPress={() => navigation.navigate('Search')}
        />
        <Icon
          style={styles.icon}
          name="playlist-music"
          size={38}
          onPress={() => navigation.navigate('Playlists')}
        />
        <MaterialIcon
          style={styles.icon}
          name="settings"
          size={38}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
      <View style={{backgroundColor:'red', flex: 1}}>
        <Player />
      </View>
    </View>
  );
};

export default HomeScreen;

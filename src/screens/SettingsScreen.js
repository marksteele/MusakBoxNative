/* eslint-disable react-native/no-inline-styles */
import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import {Text, ScrollView, View, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Auth} from 'aws-amplify';
import {clearSongFileCache} from '../util/file';
import AsyncStorage from '@react-native-community/async-storage';
import Styles from '../Styles';

const styles = Styles();

const SettingsScreen = ({navigation}) => {
  const [{downloadOnlyOnWifi, cacheMode, shuffle}, dispatch] = useContext(
    GlobalContext,
  );

  const logout = () => {
    Auth.signOut();
  };

  const clearCache = async () => {
    dispatch({type: 'setLoading', loading: true});
    await clearSongFileCache();
    await AsyncStorage.clear();
    dispatch({type: 'setRefresh', refresh: true});
  };

  const clearMetaCache = async () => {
    dispatch({type: 'setLoading', loading: true});
    await AsyncStorage.clear();
    dispatch({type: 'setRefresh', refresh: true});
  };

  return (
    <ScrollView>
      <View style={styles.settingsContainer}>
        <View>
          <MaterialIcon name="save" style={styles.icon} size={25} />
        </View>
        <View>
          <Text
            style={{...styles.primaryText, paddingLeft: 10}}
            onPress={() => navigation.navigate('Manage Playlists')}>
            Manage Playlists
          </Text>
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <MaterialIcon style={styles.icon} name="shuffle" size={25} />
        <Text style={{...styles.primaryText, paddingLeft: 10}}>Shuffle</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Switch
            ios_backgroundColor={shuffle ? 'green' : 'red'}
            onValueChange={() =>
              dispatch({
                type: 'setShuffle',
                shuffle: !shuffle,
              })
            }
            value={shuffle}
          />
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <MaterialIcon style={styles.icon} name="offline-bolt" size={30} />
        <Text style={{...styles.primaryText, paddingLeft: 10}}>Cache</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Switch
            ios_backgroundColor={cacheMode ? 'green' : 'red'}
            onValueChange={() =>
              dispatch({
                type: 'setCacheMode',
                cacheMode: !cacheMode,
              })
            }
            value={cacheMode}
          />
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <MaterialIcon style={styles.icon} name="cloud-download" size={30} />
        <Text style={{...styles.primaryText, paddingLeft: 10}}>
          Download only on wifi
        </Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <Switch
            ios_backgroundColor={downloadOnlyOnWifi ? 'green' : 'red'}
            onValueChange={() =>
              dispatch({
                type: 'setDownloadOnlyOnWifi',
                downloadOnlyOnWifi: !downloadOnlyOnWifi,
              })
            }
            value={downloadOnlyOnWifi}
          />
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <Icon style={styles.icon} name="notification-clear-all" size={30} />
        <Text
          style={{...styles.primaryText, paddingLeft: 10}}
          onPress={() => dispatch({type: 'setQueue', queue: []})}>
          Clear queue
        </Text>
      </View>
      <View style={styles.settingsContainer}>
        <MaterialIcon style={styles.icon} name="refresh" size={30} />
        <Text
          style={{...styles.primaryText, paddingLeft: 10}}
          onPress={() => clearMetaCache()}>
          Clear metadata cache
        </Text>
      </View>
      <View style={styles.settingsContainer}>
        <MaterialIcon style={styles.icon} name="delete-sweep" size={30} />
        <Text
          style={{...styles.primaryText, paddingLeft: 10}}
          onPress={() => clearCache()}>
          Clear cache
        </Text>
      </View>
      <View style={styles.settingsContainer}>
        <MaterialIcon style={styles.icon} name="logout" size={30} />
        <Text
          style={{...styles.primaryText, paddingLeft: 10}}
          onPress={() => logout()}>
          Log out
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

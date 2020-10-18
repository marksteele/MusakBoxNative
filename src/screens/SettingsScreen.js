import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import {StyleSheet, Text, ScrollView, View, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Auth} from 'aws-amplify';
import {clearSongFileCache, cachePlaylist} from '../util/file';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    flexDirection: 'row',
    paddingRight: 10,
  },
  icon: {
    width: '10%',
  },
  text: {
    fontSize: 20,
    paddingRight: 20,
  },
});

const SettingsScreen = ({navigation}) => {
  const [{queue, downloadOnlyOnWifi}, dispatch] = useContext(GlobalContext);

  const logout = () => {
    Auth.signOut();
  };

  const clearCache = async () => {
    dispatch({type: 'setLoading', loading: true});
    await clearSongFileCache();
    await AsyncStorage.clear();
    dispatch({type: 'setRefresh', refresh: true});
  };

  const cacheCurrentQueue = async () => {
    dispatch({type: 'setLoading', loading: true});
    await cachePlaylist(queue);
    dispatch({type: 'setLoading', loading: false});
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <MaterialIcon style={styles.icon} name="offline-bolt" size={30} />
        <Text style={styles.text} onPress={() => cacheCurrentQueue()}>
          Cache queue
        </Text>
      </View>
      <View style={styles.container}>
        <MaterialIcon style={styles.icon} name="cloud-download" size={30} />
        <Text style={styles.text}>Download only on wifi</Text>
        <Switch
          onValueChange={() =>
            dispatch({
              type: 'setDownloadOnlyOnWifi',
              downloadOnlyOnWifi: !downloadOnlyOnWifi,
            })
          }
          value={downloadOnlyOnWifi}
        />
      </View>
      <View style={styles.container}>
        <Icon style={styles.icon} name="notification-clear-all" size={30} />
        <Text
          style={styles.text}
          onPress={() => dispatch({type: 'setQueue', queue: []})}>
          Clear queue
        </Text>
      </View>
      <View style={styles.container}>
        <MaterialIcon style={styles.icon} name="delete-sweep" size={30} />
        <Text style={styles.text} onPress={() => clearCache()}>
          Clear cache
        </Text>
      </View>
      <View style={styles.container}>
        <MaterialIcon style={styles.icon} name="logout" size={30} />
        <Text style={styles.text} onPress={() => logout()}>
          Log out
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

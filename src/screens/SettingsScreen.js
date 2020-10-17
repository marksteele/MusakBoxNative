import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import {StyleSheet, Text, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Auth} from 'aws-amplify';
import {clearCache, cachePlaylist} from '../util/file';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    flexDirection: 'row',
  },
  icon: {
    width: '10%',
  },
  text: {
    fontSize: 20,
  },
});

const SettingsScreen = ({navigation}) => {
  const [{queue}, dispatch] = useContext(GlobalContext);

  const logout = () => {
    Auth.signOut();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <MaterialIcon style={styles.icon} name="offline-bolt" size={30} />
        <Text style={styles.text} onPress={() => cachePlaylist(queue)}>
          Cache queue
        </Text>
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

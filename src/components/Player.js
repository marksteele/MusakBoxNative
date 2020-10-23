/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {GlobalContext} from '../state/GlobalState';
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {Text, View} from 'react-native';
import {FlatList, RectButton} from 'react-native-gesture-handler';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../Styles';

const styles = Styles();

export default function Player(props) {
  const playbackState = usePlaybackState();
  const [{queue}] = useContext(GlobalContext);
  const progress = useTrackPlayerProgress();

  useTrackPlayerEvents(['playback-track-changed'], async (event) => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const index = queue.findIndex((x) => x.id === track.id);
      if (index !== -1) {
        this.flatListRef.scrollToIndex({
          animated: false,
          index: index,
        });
      }
    }
  });

  async function togglePlayback() {
    try {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack == null) {
        await TrackPlayer.skipToNext();
      } else {
        if (playbackState === TrackPlayer.STATE_PAUSED) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      }
    } catch (_) {}
  }

  return (
    <View style={{flex: 2.4, paddingBottom: 20, backgroundColor: 'black'}}>
      <View style={{flex: 1, backgroundColor: '#30475e'}}>
        <FlatList
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          data={queue}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({item, index}) => (
            <AppleStyleSwipeableRow item={item}>
              <RectButton
                style={styles.rectButton}
                onPress={() => TrackPlayer.skip(item.id)}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </RectButton>
            </AppleStyleSwipeableRow>
          )}
        />
      </View>
      <View style={{flex: 0.15, backgroundColor: 'black'}}>
        <View style={styles.progress}>
          <View style={{flex: progress.position, backgroundColor: 'red'}} />
          <View
            style={{
              flex: progress.duration - progress.position,
              backgroundColor: 'grey',
            }}
          />
        </View>
        <View style={styles.container}>
          <Icon
            style={styles.icon}
            size={30}
            name="skip-previous"
            onPress={() => TrackPlayer.skipToPrevious()}
          />
          {playbackState === TrackPlayer.STATE_PAUSED ? (
            <Icon
              style={styles.icon}
              size={29}
              name="play"
              onPress={() => togglePlayback()}
            />
          ) : (
            <Icon
              style={styles.icon}
              size={29}
              name="pause"
              onPress={() => togglePlayback()}
            />
          )}
          <Icon
            style={styles.icon}
            size={29}
            name="skip-next"
            onPress={() => TrackPlayer.skipToNext()}
          />
        </View>
      </View>
    </View>
  );
}

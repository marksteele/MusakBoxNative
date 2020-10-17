/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, useEffect} from 'react';
import {GlobalContext} from '../state/GlobalState';
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {StyleSheet, Text, View} from 'react-native';
import {FlatList, RectButton} from 'react-native-gesture-handler';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';
import {fetchCacheFile, fetchFile} from '../util/file.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import NetInfo from '@react-native-community/netinfo';

export default function Player(props) {
  const playbackState = usePlaybackState();
  const [{queue, downloadOnlyOnWifi}] = useContext(GlobalContext);
  const [shuffle, setShuffle] = useState(false);
  const [playing, setPlaying] = useState(0);
  const [loop, setLoop] = useState(false);
  const progress = useTrackPlayerProgress();
  const [connected, setConnected] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

  useTrackPlayerEvents(['playback-queue-ended'], async (event) => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_QUEUE_ENDED) {
      skipToNext();
    }
  });

  useEffect(() => {
    NetInfo.addEventListener((conn) => {
      setConnectionType(conn.type);
      setConnected(conn.isConnected);
    });
  }, []);

  async () => {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });
  };

  async function playIdx(idx, dir) {
    let url;
    try {
      if (!connected || (downloadOnlyOnWifi && connectionType !== 'wifi')) {
        url = await fetchCacheFile(queue[idx].key);
      } else {
        url = await fetchFile(queue[idx].key);
      }
      await TrackPlayer.reset();
      this.flatListRef.scrollToIndex({
        animated: false,
        index: idx,
      });
      await TrackPlayer.add({
        ...queue[idx],
        url: url,
      });
      await TrackPlayer.play();
      setPlaying(idx);
    } catch (err) {
      console.log('THREW! LOOP! ' + idx);
      return dir === 'next' ? skipToNext(idx) : skipToPrevious(idx);
    }
  }

  async function skipToNext(current) {
    let idx;
    if (Array.isArray(queue) && queue.length > 0) {
      if (shuffle) {
        // Shuffle on, don't care about order
        idx = Math.floor(Math.random() * queue.length);
      } else {
        if (loop) {
          // Loooping. If at end, wrap
          idx = current === queue.length - 1 ? 0 : current + 1;
        } else {
          // Not looping. If at end, stop.
          if (current === queue.length - 1) {
            return;
          }
          idx = current + 1;
        }
      }
      await playIdx(idx, 'next');
    }
  }

  async function skipToPrevious(current) {
    let idx;
    if (Array.isArray(queue) && queue.length > 0) {
      if (shuffle) {
        // Shuffle on, don't care about order
        idx = Math.floor(Math.random() * queue.length);
      } else {
        if (loop) {
          // Loooping. If at start, wrap
          idx = current > 0 ? current - 1 : queue.length - 1;
        } else {
          // Not looping. If at start, stop.
          if (current === 0) {
            return;
          }
          idx = current - 1;
        }
      }
      await playIdx(idx, 'prev');
    }
  }

  async function togglePlayback() {
    try {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack == null) {
        skipToNext();
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
    <View style={{flex: 2}}>
      <View style={{flex: 1, backgroundColor: 'lightgrey'}}>
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
                onPress={() => playIdx(index)}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
              </RectButton>
            </AppleStyleSwipeableRow>
          )}
          keyExtractor={(item, index) => `message ${index}`}
        />
      </View>
      <View style={{flex: 0.5, backgroundColor: 'darkgrey'}}>
        <View style={styles.progress}>
          <View style={{flex: progress.position, backgroundColor: 'red'}} />
          <View
            style={{
              flex: progress.duration - progress.position,
              backgroundColor: 'grey',
            }}
          />
        </View>
        <View style={styles.controlButtonContainer}>
          <Icon
            name="shuffle"
            size={30}
            onPress={() => setShuffle(!shuffle)}
            color={shuffle ? 'red' : 'black'}
          />
          <Icon
            name="skip-previous"
            size={30}
            onPress={() => skipToPrevious(playing)}
          />
          {playbackState === TrackPlayer.STATE_PAUSED ? (
            <Icon name="play" size={30} onPress={() => togglePlayback()} />
          ) : (
            <Icon name="pause" size={30} onPress={() => togglePlayback()} />
          )}
          <Icon
            name="skip-next"
            size={30}
            onPress={() => skipToNext(playing)}
          />
          <MaterialIcon
            name="loop"
            size={30}
            onPress={() => setLoop(!loop)}
            color={loop ? 'red' : 'black'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    elevation: 1,
    borderRadius: 4,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    alignItems: 'center',
    shadowColor: 'black',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 1},
  },
  progress: {
    height: 1,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
  },
  controlButtonContainer: {
    flex: 1,
    paddingTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  separator: {
    backgroundColor: 'rgb(200, 199, 204)',
    height: StyleSheet.hairlineWidth,
  },
  title: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  artist: {
    color: '#999',
    backgroundColor: 'transparent',
  },
});

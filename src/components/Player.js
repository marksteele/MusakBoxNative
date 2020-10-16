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
import {fetchSongUrl} from '../util/songs.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaertialIcon from 'react-native-vector-icons/MaterialIcons';

export default function Player(props) {
  const playbackState = usePlaybackState();
  const [{queue}] = useContext(GlobalContext);
  const [shuffle, setShuffle] = useState(false);
  const [playing, setPlaying] = useState(0);
  const [loop, setLoop] = useState(false);
  const progress = useTrackPlayerProgress();

  // Will fire when songs in queue done. We'll keep only 1 song in queue
  useTrackPlayerEvents(['playback-queue-ended'], async (event) => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_QUEUE_ENDED) {
      skipToNext();
    }
  });
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

  const lookupUrls = (songs) => {
    return Promise.all(
      songs.map((x) => {
        return fetchSongUrl(x.key).then((res) => {
          return {...x, url: res};
        });
      }),
    ).then((results) => results);
  };

  useEffect(() => {
    if (Array.isArray(queue)) {
      TrackPlayer.reset()
        .then(() => {
          if (queue.length > 0) {
            return lookupUrls(queue).then((songs) => {
              return TrackPlayer.add(songs);
            });
          }
          return Promise.resolve();
        })
        .catch((err) => console.log(err));
    }
  }, [queue]);

  async function playIdx(idx) {
    console.log(`Attempting to play ${queue[idx].key} - ${idx}`);
    try {
      console.log('RESSETTING PLAYER...');
      await TrackPlayer.reset();
      console.log('RESSETTING PLAYER...DONE');
      console.log('SCROLLING...');
      this.flatListRef.scrollToIndex({
        animated: true,
        index: idx,
      });
      console.log('SCROLLING...DONE');
      console.log('ADDING TRACK');
      await TrackPlayer.add({
        ...queue[idx],
        url: await fetchSongUrl(queue[idx].key),
      });
      console.log('ADDRING TRACK DONE');
      console.log('PLAYING...');
      await TrackPlayer.play();
      console.log('PLAYING...DONE');
      console.log('SETTING CURRENT INDEX TO STATE...');
      setPlaying(idx);
      console.log('SETTING CURRENT INDEX TO STATE...DONE');
    } catch (_) {}
  }

  async function skipToNext() {
    let idx;
    if (Array.isArray(queue) && queue.length > 0) {
      if (shuffle) {
        // Shuffle on, don't care about order
        idx = Math.floor(Math.random() * queue.length);
      } else {
        if (loop) {
          // Loooping. If at end, wrap
          idx = playing === queue.length - 1 ? 0 : playing + 1;
        } else {
          // Not looping. If at end, stop.
          if (playing === queue.length - 1) {
            return;
          }
          idx = playing + 1;
        }
      }
      await playIdx(idx);
    }
  }

  async function skipToPrevious() {
    let idx;
    if (Array.isArray(queue) && queue.length > 0) {
      if (shuffle) {
        // Shuffle on, don't care about order
        idx = Math.floor(Math.random() * queue.length);
      } else {
        if (loop) {
          // Loooping. If at start, wrap
          idx = playing > 0 ? playing - 1 : queue.length - 1;
        } else {
          // Not looping. If at start, stop.
          if (playing === 0) {
            return;
          }
          idx = playing - 1;
        }
      }
      await playIdx(idx);
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
                <Text style={styles.fromText}>{item.title}</Text>
                <Text style={styles.messageText}>{item.artist}</Text>
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
            style={styles.controls}
            name="shuffle"
            size={30}
            onPress={() => setShuffle(!shuffle)}
            color={shuffle ? 'red' : 'black'}
          />
          <Icon
            style={styles.controls}
            name="skip-previous"
            size={30}
            onPress={() => skipToPrevious()}
          />
          {playbackState === TrackPlayer.STATE_PAUSED ? (
            <Icon
              style={styles.controls}
              name="play"
              size={30}
              onPress={() => togglePlayback()}
            />
          ) : (
            <Icon
              style={styles.controls}
              name="pause"
              size={30}
              onPress={() => togglePlayback()}
            />
          )}
          <Icon
            style={styles.controls}
            name="skip-next"
            size={30}
            onPress={() => skipToNext()}
          />
          <MaertialIcon
            style={styles.controls}
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
  cover: {
    width: 140,
    height: 140,
    marginTop: 20,
    backgroundColor: 'grey',
  },
  progress: {
    height: 1,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
  },
  title: {
    marginTop: 10,
  },
  artist: {
    fontWeight: 'bold',
  },
  controls: {
    marginVertical: 20,
    flexDirection: 'row',
    flex: 1,
  },
  controlButtonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 22,
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
  fromText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  messageText: {
    color: '#999',
    backgroundColor: 'transparent',
  },
});

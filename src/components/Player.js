/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext, useEffect} from 'react';
import {GlobalContext} from '../state/GlobalState';
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {
  StyleSheet,
  FlatList,
  Button,
  Text,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

function ProgressBar() {
  const progress = useTrackPlayerProgress();

  return (
    <View style={styles.progress}>
      <View style={{flex: progress.position, backgroundColor: 'red'}} />
      <View
        style={{
          flex: progress.duration - progress.position,
          backgroundColor: 'grey',
        }}
      />
    </View>
  );
}

export default function Player(props) {
  const playbackState = usePlaybackState();
  const [{addToQueue, queue}, dispatch] = useContext(GlobalContext);
  const [shuffle, setShuffle] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [render, setRender] = useState([]);

  useTrackPlayerEvents(['playback-track-changed'], async (event) => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artist} = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
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

  useEffect(() => {
    if (addToQueue !== undefined && Object.keys(addToQueue).length !== 0) {
      TrackPlayer.getQueue().then((queueSongs) => {
        const qSet = new Set([...queueSongs.map((x) => x.id)]);
        console.log(qSet);
        if (!qSet.has(addToQueue.id)) {
          console.log('SET DOES NOT HAS ' + addToQueue.id);
          setRender([...queueSongs, addToQueue]);
          TrackPlayer.add(addToQueue)
            .then((res) => {
              console.log('Added track');
              dispatch({type: 'addToQueue', song: {}});
            })
            .catch((err) => console.log(err));
        } else {
          console.log('SET HAS ' + addToQueue.id);
        }
      });
    }
  }, [addToQueue]);

  useEffect(() => {
    if (Array.isArray(queue)) {
      console.log('SETTING RENDER TO QUEUE');
      setRender(queue);
      TrackPlayer.reset()
        .then(() => {
          console.log('RESET QUEUE ON PLAYER');
          if (queue.length > 0) {
            console.log('Added tracks');
            return TrackPlayer.add(queue);
          }
          return Promise.resolve();
        })
        .then(() => {
          console.log('Queue now contains: ');
          console.log(queue);
        })
        .catch((err) => console.log(err));
    }
  }, [queue]);

  async function skipToNext() {
    if (shuffle) {
      try {
        const q = await TrackPlayer.getQueue();
        const randomId = q[Math.floor(Math.random() * q.length)].id;
        console.log('Next random song is: ' + randomId);
        await TrackPlayer.skip(randomId);
      } catch (_) {}
    } else {
      try {
        await TrackPlayer.skipToNext();
      } catch (_) {}
    }
  }

  async function skipToPrevious() {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (_) {}
  }

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack == null) {
      try {
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
      } catch (_) {}
    } else {
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  }

  let middleButton = <Text onPress={() => togglePlayback()}>Play</Text>;

  if (
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING
  ) {
    middleButton = <Text onPress={() => togglePlayback()}>Pause</Text>;
  }

  function getStateName(state) {
    switch (state) {
      case TrackPlayer.STATE_NONE:
        return 'None';
      case TrackPlayer.STATE_PLAYING:
        return 'Playing';
      case TrackPlayer.STATE_PAUSED:
        return 'Paused';
      case TrackPlayer.STATE_STOPPED:
        return 'Stopped';
      case TrackPlayer.STATE_BUFFERING:
        return 'Buffering';
    }
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}}>
        <Text>Queue...</Text>
        <FlatList
          data={render}
          renderItem={({item}) => (
            <Button
              title={`${item.title} by ${item.artist}`}
              onPress={() => TrackPlayer.skip(item.id)}
            />
          )}
        />
      </View>
      <View style={{flex: 0.5, backgroundColor: 'skyblue'}}>
        <ProgressBar />
        <View style={styles.controls}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={shuffle ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setShuffle(!shuffle)}
            value={shuffle}
          />
          <Button title={'<<'} onPress={() => skipToPrevious()} />
          {middleButton}
          <Button title={'>>'} onPress={() => skipToNext()} />
        </View>
        <Text style={styles.state}>
          {getStateName(playbackState)}{' '}
          {trackTitle ? `${trackTitle} by ${trackArtist}` : ''}
        </Text>
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
    width: '90%',
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
  },
  controlButtonContainer: {
    flex: 1,
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 22,
  },
});

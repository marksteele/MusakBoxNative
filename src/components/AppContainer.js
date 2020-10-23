/* eslint-disable react-hooks/exhaustive-deps */
import {GlobalContext} from '../state/GlobalState';
import React, {useContext, useEffect, useState} from 'react';
import {fetchPlaylists} from '../util/playlists';
import {listSongs, fetchSongUrl} from '../util/songs';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import asyncPool from 'tiny-async-pool';
import {isCached, filePath, fetchFile} from '../util/file';
import TrackPlayer from 'react-native-track-player';

const AppContainer = (props) => {
  const [
    {refresh, loading, queue, downloadOnlyOnWifi, cacheMode},
    dispatch,
  ] = useContext(GlobalContext);
  const [connected, setConnected] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

  async function handleQueueChange() {
    await TrackPlayer.reset();
    if (!connected || (downloadOnlyOnWifi && connectionType !== 'wifi')) {
      // Offline only mode.
      console.log('Offline only mode. Filtering out uncached songs...');
      const cachedSongs = queue.reduce(async (acc, song) => {
        if (await isCached(song.key)) {
          return [...acc, {...song, url: filePath(song.key)}];
        }
      });
      // Send this to TrackPlayer.
      await TrackPlayer.add(cachedSongs);
      await TrackPlayer.play();
    } else {
      console.log('Connected and can download...');
      // We're connected and can download things.
      if (!cacheMode) {
        queue.forEach((song) => {
          fetchSongUrl(song.key)
            .then((url) => TrackPlayer.add({...song, url: url}))
            .catch((err) => console.log(err));
        });

        await TrackPlayer.play();
        dispatch({type: 'setLoading', loading: false});
        return;
      }
      // Cache first mode. Cache and play first song
      await TrackPlayer.add({
        ...queue[0],
        url: (await isCached(queue[0].key))
          ? filePath(queue[0].key)
          : await fetchFile(queue[0].key),
      });
      await TrackPlayer.play();
      if (queue.length > 1) {
        // Cache the rest of the songs...
        await asyncPool(2, queue.slice(1, queue.length), async (song) => {
          await TrackPlayer.add({
            ...song,
            url: (await isCached(song.key))
              ? filePath(song.key)
              : await fetchFile(song.key),
          });
        });
      }
    }
    dispatch({type: 'setLoading', loading: false});
  }

  // Initial data load
  useEffect(() => {
    refreshMeta();
    NetInfo.addEventListener((conn) => {
      setConnectionType(conn.type);
      setConnected(conn.isConnected);
    });
  }, []);

  useEffect(() => {
    if (refresh) {
      dispatch({type: 'setRefresh', refresh: false});
      refreshMeta();
    }
  }, [refresh]);

  useEffect(() => {
    if (Array.isArray(queue) && queue.length) {
      dispatch({type: 'setLoading', loading: true});
      handleQueueChange();
    } else {
      TrackPlayer.reset();
    }
  }, [queue]);

  useEffect(() => {
    if (queue.length) {
      dispatch({type: 'setLoading', loading: true});
      handleQueueChange();
    } else {
      TrackPlayer.reset();
    }
  }, [cacheMode]);

  useEffect(() => {
    if (queue.length) {
      dispatch({type: 'setLoading', loading: true});
      handleQueueChange();
    } else {
      TrackPlayer.reset();
    }
  }, [downloadOnlyOnWifi]);

  const refreshMeta = async () => {
    dispatch({type: 'setSongList', songs: await listSongs()});
    dispatch({type: 'setPlaylists', playlists: await fetchPlaylists()});
    dispatch({type: 'setLoading', loading: false});
  };

  return (
    <>
      <Spinner visible={loading} size="large" animation="fade" />
      {props.children}
    </>
  );
};

export default AppContainer;

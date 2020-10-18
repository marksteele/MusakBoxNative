/* eslint-disable react-hooks/exhaustive-deps */
import {GlobalContext} from '../state/GlobalState';
import React, {useContext, useEffect} from 'react';
import Player from '../components/Player';
import {fetchPlaylists} from '../util/playlists';
import {listSongs} from '../util/songs';
import Spinner from 'react-native-loading-spinner-overlay';

const AppContainer = (props) => {
  const [{refresh, loading}, dispatch] = useContext(GlobalContext);

  // Initial data load
  useEffect(() => {
    refreshMeta();
  }, []);

  useEffect(() => {
    if (refresh) {
      dispatch({type: 'setRefresh', refresh: false});
      refreshMeta();
    }
  }, [refresh]);

  const refreshMeta = async () => {
    dispatch({type: 'setSongList', songs: await listSongs()});
    dispatch({type: 'setPlaylists', playlists: await fetchPlaylists()});
    dispatch({type: 'setLoading', loading: false});
  };

  return (
    <>
      <Spinner visible={loading} size="large" animation="fade" />
      {props.children}
      <Player />
    </>
  );
};

export default AppContainer;

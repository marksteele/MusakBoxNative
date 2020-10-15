/* eslint-disable react-hooks/exhaustive-deps */
import {GlobalContext} from '../state/GlobalState';
import React, {useContext, useEffect} from 'react';
import Player from '../components/Player';
import {fetchPlaylists} from '../util/playlists';
import {listSongs} from '../util/songs';

const AppContainer = (props) => {
  const [{}, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    listSongs().then((songs) => {
      dispatch({type: 'setSongList', songs: songs});
    });
    fetchPlaylists().then((playlists) => {
      dispatch({type: 'setPlaylists', playlists: playlists});
    });
  }, []);

  return (
    <>
      {props.children}
      <Player />
    </>
  );
};

export default AppContainer;

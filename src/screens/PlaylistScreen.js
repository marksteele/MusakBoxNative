import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import PlaylistList from '../components/PlaylistList';

const PlaylistScreen = ({navigation}) => {
  const [{playlists}] = useContext(GlobalContext);
  return (
    <>
      <PlaylistList
        playlists={playlists.map((x) => {
          return {id: x};
        })}
      />
    </>
  );
};

export default PlaylistScreen;

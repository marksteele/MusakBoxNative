import {actionIcon} from 'aws-amplify';
import React, {useReducer} from 'react';
export const GlobalContext = React.createContext();

const initialState = {
  songList: [], // The "everything" list. [{key: 'songs/s3/path.mp3', title: 'choo choo', artist: 'foo man chew'}]
  addToQueue: {}, // List of songs in queue to play
  playlists: [], // Lists of playlists
  artists: [], // Lists of artists
  search: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setSongList':
      return {
        ...state,
        songList: action.songs,
        artists: [...new Set(action.songs.map((x) => x.artist))],
      };
    case 'setAddToQueue':
      return {
        ...state,
        addToQueue: action.song,
      };
    case 'removeFromQueue':
      return {
        ...state,
        queue: state.queue.filter((x) => x.key !== action.key),
      };
    case 'setPlaylists':
      return {
        ...state,
        playlists: action.playlists,
      };
    case 'setSearch': {
      return {
        ...state,
        search: action.search,
      };
    }
    case 'setQueue':
      console.log('STATE UPDATE FOR QUEUE');
      return {
        ...state,
        queue: action.queue,
      };
    default:
      return state;
  }
};

export const GlobalState = (props) => {
  const globalState = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={globalState}>
      {props.children}
    </GlobalContext.Provider>
  );
};

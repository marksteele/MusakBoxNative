import React, {useReducer} from 'react';
export const GlobalContext = React.createContext();

const initialState = {
  songList: [], // The "everything" list. [{key: 'songs/s3/path.mp3', title: 'choo choo', artist: 'foo man chew'}]
  addToQueue: {}, // List of songs in queue to play
  playlists: [], // Lists of playlists
  artists: [], // Lists of artists
  search: {},
  queue: [],
  downloadOnlyOnWifi: true,
  loading: true,
  shuffle: false,
  loop: false,
  cacheMode: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCacheMode':
      return {
        ...state,
        cacheMode: action.cacheMode,
      };
    case 'setShuffle':
      return {
        ...state,
        shuffle: action.shuffle,
      };
    case 'setLoop':
      return {
        ...state,
        loop: action.loop,
      };
    case 'setPlaying':
      return {
        ...state,
        playing: action.playing,
      };
    case 'setLoading':
      return {
        ...state,
        loading: action.loading,
      };
    case 'setRefresh':
      return {
        ...state,
        refresh: action.refresh,
      };
    case 'setDownloadOnlyOnWifi':
      return {
        ...state,
        downloadOnlyOnWifi: action.downloadOnlyOnWifi,
      };
    case 'setSongList':
      return {
        ...state,
        songList: action.songs,
        artists: [...new Set(action.songs.map((x) => x.artist))],
      };
    case 'setAddToQueue':
      return {
        ...state,
        queue: Array.from(new Set([action.song, ...state.queue])),
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
      return {
        ...state,
        queue: state.shuffle
          ? action.queue.sort(() => 0.5 - Math.random())
          : action.queue,
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

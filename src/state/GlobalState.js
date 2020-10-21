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
      console.log(`New Queue has ${action.queue.length} items`);
      if (state.shuffle && action.queue.length > 2) {
        for (var i = action.queue.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = action.queue[i];
          action.queue[i] = action.queue[j];
          action.queue[j] = temp;
        }
      }
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

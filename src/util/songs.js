import {Storage} from 'aws-amplify';
import AsyncStorage from '@react-native-community/async-storage';

export function listSongs() {
  return AsyncStorage.getItem('songs').then((songsCached) => {
    if (songsCached !== null) {
      console.log('Song list cache hit');
      return JSON.parse(songsCached);
    }
    console.log('Song list cache miss');
    return Promise.all(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        .split('')
        .map((item) => Storage.list(`songs/${item}`, {level: 'private'})),
    )
      .then((responses) => {
        let songs = [];
        responses.forEach((response) => {
          response.forEach((item) => {
            songs.push(parseInfo(item.key));
          });
        });
        return songs;
      })
      .then((songs) => {
        return AsyncStorage.setItem('songs', JSON.stringify(songs)).then(
          () => songs,
        );
      });
  });
}

export function parseInfo(key) {
  const match = key.match(/^songs\/([^/]+)\/(.+)\..+$/);
  return match
    ? {key: key, artist: match[1], title: match[2], id: key}
    : {artist: 'unknown', title: key};
}

export function fetchSongUrl(key) {
  return Storage.get(key, {level: 'private', expires: 86400}).then(
    (result) => result,
  );
}

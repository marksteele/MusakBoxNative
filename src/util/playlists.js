import {Storage} from 'aws-amplify';
import {parseInfo} from './songs.js';
import AsyncStorage from '@react-native-community/async-storage';

export function fetchPlaylists() {
  return AsyncStorage.getItem('playlists/')
    .then((cached) => {
      if (cached !== null) {
        console.log("Playlist list cache hit");
        return JSON.parse(cached);
      }
      console.log("Playlist list cache miss");
      return Storage.list('playlists/', {
        level: 'private',
        maxKeys: 9999,
      }).then((data) => {
        return AsyncStorage.setItem('playlists/', JSON.stringify(data)).then(
          () => data,
        );
      });
    })
    .then((response) =>
      response.map((item) => item.key.slice(10, item.key.length)),
    );
}

export function loadPlaylist(key) {
  return AsyncStorage.getItem(`playlists/${key}`)
    .then((cached) => {
      if (cached !== null) {
        console.log("Playlist cache hit");
        return cached;
      }
      console.log("Playlist cache miss");
      return loadFile(`playlists/${key}`);
    })
    .then((data) => {
      return AsyncStorage.setItem(`playlists/${key}`, data).then(() => data);
    })
    .then((data) =>
      data
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((i) => parseInfo(i)),
    );
}

export function loadFile(key) {
  return Storage.get(key, {level: 'private', expires: 60})
    .then((response) => fetch(response))
    .then((fetchResponse) => {
      if (fetchResponse.ok) {
        return fetchResponse.text();
      }
      return '';
    });
}

export function savePlaylist(playlist, songs) {
  const data = songs.map((e) => e.key).join('\n');
  return Storage.put(`playlists/${playlist}`, data, {
    level: 'private',
  }).then(() => AsyncStorage.setItem(`playlists/${playlist}`, data));
}

export function removePlaylist(playlist) {
  return Storage.remove(`playlists/${playlist}`, {level: 'private'}).then(() =>
    AsyncStorage.removeItem(`playlists/${playlist}`),
  );
}

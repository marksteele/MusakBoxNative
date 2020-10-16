import {Storage} from 'aws-amplify';
import {parseInfo} from './songs.js';

export function fetchPlaylists() {
  return Storage.list('playlists/', {
    level: 'private',
    maxKeys: 9999,
  }).then((response) =>
    response.map((item) => item.key.slice(10, item.key.length)),
  );
}

export function loadPlaylist(key) {
  return loadFile(`playlists/${key}`).then((data) =>
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
  return Storage.put(
    `playlists/${playlist}`,
    songs.map((e) => e.key).join('\n'),
    {level: 'private'},
  );
}

export function removePlaylist(playlist) {
  return Storage.remove(`playlists/${playlist}`, {level: 'private'});
}

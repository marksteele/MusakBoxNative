import {Storage} from 'aws-amplify';

export function listSongs() {
  return Promise.all(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      .split('')
      .map((item) => Storage.list(`songs/${item}`, {level: 'private'})),
  ).then((responses) => {
    let songs = [];
    responses.forEach((response) => {
      response.forEach((item) => {
        songs.push(parseInfo(item.key));
      });
    });
    return songs;
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

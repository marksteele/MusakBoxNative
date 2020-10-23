import {Storage} from 'aws-amplify';
import AsyncStorage from '@react-native-community/async-storage';
import {filePath} from './file';

export function listSongs() {
  return AsyncStorage.getItem('songs').then((songsCached) => {
    if (songsCached !== null) {
      return JSON.parse(songsCached);
    }
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
    ? {
        key: key,
        artist: match[1],
        title: cleanTitle(match[2], match[1]),
        id: key,
      }
    : {artist: 'unknown', title: key};
}

export function fetchSongUrl(key) {
  return Storage.get(key, {level: 'private', expires: 86400}).then(
    (result) => result,
  );
}

function cleanTitle(title, artist) {
  if (/sister/i.test(title)) {
    console.log(title);
  }
  return title
    .replace(/^[^/]+\//, '') // Remove folder paths
    .replace(new RegExp(`${artist}`, 'gi'), '') // Remove artist
    .replace('()', '')
    .replace(/^ - /, '')
    .replaceAll('_', ' ') // Replace understores with spaces
    .trim() // Remove space around
    .replace(/\s{2,}/, ' ') // Replace multiple spaces with one
    .replace(/^\d+\./, '') // 01. blah
    .replace(/^\s*-\s+/, '')
    .replace(/-?\s\(\d+\)/, '')
    .replace(/^(.+? ?- ?)+/, '')
    .replace(/^\d{2,2}\s/, '')
    .trim()
    .replace(/^-\s?/,'')
    .replace(' 192 lame cbr', '');
}

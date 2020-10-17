import RNFetchBlob from 'rn-fetch-blob';
import {fetchSongUrl} from './songs';
import {dirname} from 'react-native-path';

const dirs = RNFetchBlob.fs.dirs;
const basePath = `${dirs.CacheDir}/Emusak`;

export function fetchSong(key) {
  const safePath = `${basePath}/${key.replace(/[ !@#$%^&*()-+=]/g, '_')}`;
  const cachePath = dirname(safePath);
  const result = `file://${safePath}`;
  return RNFetchBlob.fs
    .exists(cachePath)
    .then((exists) => {
      if (!exists) {
        return RNFetchBlob.fs.mkdir(cachePath);
      }
      return Promise.resolve();
    })
    .then(() => {
      return RNFetchBlob.fs.exists(safePath).then((exists) => {
        if (exists) {
          return result;
        } else {
          return fetchSongUrl(key).then((url) => {
            return RNFetchBlob.config({
              path: safePath,
            })
              .fetch('GET', url)
              .then((res) => {
                if (res.info().status === 200) {
                  return result;
                }
                throw new Error(
                  `Unable to download file: ${res.info().status}`,
                );
              });
          });
        }
      });
    });
}

export function cachePlaylist(songs) {
  return Promise.all(songs.map((song) => fetchSong(song.key))).catch(() => {});
}

export function clearCache() {
  RNFetchBlob.fs
    .unlink(basePath)
    .then(() => {
      alert('Cache cleared');
    })
    .catch((err) => {
      alert('Could not clear cache');
    });
}

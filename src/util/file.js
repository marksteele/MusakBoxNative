import RNFetchBlob from 'rn-fetch-blob';
import {fetchSongUrl} from './songs';
import {dirname} from 'react-native-path';

const dirs = RNFetchBlob.fs.dirs;
const basePath = `${dirs.CacheDir}/Emusak`;

function safePaths(key) {
  const safePath = `${basePath}/${key.replace(/[ !@#$%^&*()-+=]/g, '_')}`;
  const cachePath = dirname(safePath);
  const resultPath = `file://${safePath}`;
  return RNFetchBlob.fs
    .exists(cachePath)
    .then((exists) => {
      if (!exists) {
        return RNFetchBlob.fs.mkdir(cachePath);
      }
      return Promise.resolve();
    })
    .then(() => {
      return {safePath, resultPath};
    });
}

export function fetchFile(key) {
  return safePaths(key).then(({safePath, resultPath}) => {
    return fetchCacheFile(key)
      .then((res) => res)
      .catch(() => {
        return fetchSongUrl(key).then((url) => {
          return RNFetchBlob.config({
            path: safePath,
          })
            .fetch('GET', url)
            .then((res) => {
              if (res.info().status === 200) {
                return resultPath;
              }
              throw new Error(`Unable to download file: ${res.info().status}`);
            });
        });
      });
  });
}

export function fetchCacheFile(key) {
  return safePaths(key).then(({safePath, resultPath}) => {
    return RNFetchBlob.fs.exists(safePath).then((exists) => {
      if (exists) {
        console.log('Song file cache hit');
        return resultPath;
      }
      console.log('Song file cache miss');
      throw new Error('File not found');
    });
  });
}

export function cachePlaylist(songs) {
  return Promise.all(songs.map((song) => fetchFile(song.key))).catch(() => {});
}

export async function isCached(key) {
  const {safePath, _} = safePaths(key);
  return await RNFetchBlob.fs.exists(safePath);
}

export function clearSongFileCache() {
  console.log('Clearing all cached songs');
  return RNFetchBlob.fs.unlink(basePath);
}

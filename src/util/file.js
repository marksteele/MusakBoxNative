import RNFetchBlob from 'rn-fetch-blob';
import {fetchSongUrl} from './songs';
import {dirname} from 'react-native-path';

const dirs = RNFetchBlob.fs.dirs;
const basePath = `${dirs.CacheDir}/Emusak`;

function safeKey(key) {
  return `${basePath}/${key.replace(/[ !@#$%^&*()-+=]/g, '_')}`;
}

function filePath(key) {
  return `file://${safeKey(key)}`;
}

function ensurePaths(key) {
  const cachePath = dirname(safeKey(key));
  return RNFetchBlob.fs.exists(cachePath).then((exists) => {
    if (!exists) {
      return RNFetchBlob.fs.mkdir(cachePath);
    }
    return Promise.resolve();
  });
}

export function fetchFile(key) {
  const safePath = safeKey(key);
  const resultPath = filePath(key);
  return ensurePaths(key).then(() => {
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
  const safePath = safeKey(key);
  const resultPath = filePath(key);
  return ensurePaths(key).then(() => {
    return RNFetchBlob.fs.exists(safePath).then((exists) => {
      if (exists) {
        console.log('Song file cache hit: ' + key);
        return resultPath;
      }
      console.log('Song file cache miss: ' + key);
      throw new Error('File not found');
    });
  });
}

export async function isCached(key) {
  return await RNFetchBlob.fs.exists(filePath(key));
}

export function clearSongFileCache() {
  console.log('Clearing all cached songs');
  return RNFetchBlob.fs.unlink(basePath);
}

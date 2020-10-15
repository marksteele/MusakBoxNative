export function fetchPlaylists() {
  return Promise.resolve(['listOne','listTwo','listThree','listFour','listFive']);
}

export function loadPlaylist(key) {
  return Promise.resolve([
    {
      id: '3333',
      url:
        'https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI',
      title: 'Lullaby (Demo)',
      artist: 'Bobby Buzzkill',
      artwork: 'https://i.picsum.photos/id/300/200/200.jpg',
      duration: 71,
    },
    {
      id: '4444',
      url:
        'https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC',
      title: 'Rhythm City (Demo)',
      artist: 'Bullet Tooth Tony',
      artwork: 'https://i.picsum.photos/id/400/200/200.jpg',
      duration: 106,
    },
  ]);
}

export function savePlaylist(playlist, songs) {
    return Promise.resolve();
}

export function removePlaylist(playlist) {
  return Promise.resolve();
}
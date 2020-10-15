import {GlobalContext} from '../state/GlobalState';
import React, {useContext} from 'react';
import ArtistList from '../components/ArtistList';

const ArtistScreen = ({navigation}) => {
  const [{artists}] = useContext(GlobalContext);
  return (
    <>
      <ArtistList
        artists={artists.map((x) => {
          return {key: x, artist: x};
        })}
      />
    </>
  );
};

export default ArtistScreen;

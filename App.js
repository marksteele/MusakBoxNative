import React from 'react';
import ArtistScreen from './src/screens/ArtistScreen';
import SearchScreen from './src/screens/SearchScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlaylistScreen from './src/screens/PlaylistScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EditPlaylistScreen from './src/screens/EditPlaylistScreen';
import {GlobalState} from './src/state/GlobalState';
import AppContainer from './src/components/AppContainer';
import {NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {withAuthenticator} from 'aws-amplify-react-native';
const Stack = createStackNavigator();

const Dark = {
  dark: false,
  colors: {
    primary: 'white',
    background: 'black',
    card: '#84142d',
    text: 'white',
    border: '#1e5f74',
    notification: '#fcdab7',
  },
};

const App = () => {
  return (
    <GlobalState>
      <AppContainer>
        <NavigationContainer theme={Dark}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen}  />
            <Stack.Screen name="Artists" component={ArtistScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Playlists" component={PlaylistScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
              name="Manage Playlists"
              component={EditPlaylistScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContainer>
    </GlobalState>
  );
};

//export default App;
export default withAuthenticator(App);

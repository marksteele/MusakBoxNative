import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';

import TrackPlayer from 'react-native-track-player';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import App from './App';

Amplify.configure(config);

AppRegistry.registerComponent('MusakBoxNative', () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));

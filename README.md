# MusakBoxNative

My first React Native App.

It's a music player that streams from your very own AWS account, specifically S3.

It's the native version of this: https://github.com/marksteele/MusakBox


```
npm i
npx react-native link
npx pod-install
npx react-native run-ios --simulator "iPhone SE (iOS 14.0)"
```

# TODO

* Document the setup to hook this into the same AWS as MusakBox (share the same Amplify setup between web app and native app).
* Move everything related to the player instance controls into service to make remote buttons work
* Playlist management
* Magic wand button: random playlist
* Cut a build of this for androids? Why not!

# Notes

Stuff I had to do to get this to build:

Setting up fonts:

https://www.youtube.com/watch?v=fVoEojORQyQ


Getting the track player to work: 

https://react-native-track-player.js.org/install/#troubleshooting (bridging header bits)

App icons:

https://medium.com/better-programming/react-native-add-app-icons-and-launch-screens-onto-ios-and-android-apps-3bfbc20b7d4c


Running the build from the main xcode entrypoint was spewing out errors. Launching it like this worked:

```
cd ios
open MusakBoxNative.xcworkspace
```

Had to set the target version for iOS to 11. Also had to edit the info.plist to set the right version number.

To open the app on my phone, I had to go into `iphone settings -> general -> device management` and approve my cert after the app had been pushed to trust myself.

Also had to fiddle with the capabilities: `allow background processing` and `audio` to get the background audio working when app not active.


# Misc stuff

Network detection in simulator is flackey. Apparently works in real app.

https://reactnative.dev/docs/running-on-device


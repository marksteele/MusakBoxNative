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
* Feedback after clearing things
* Would be good to have feedback during loading of things
* Move everything related to the player instance controls into service to make remote buttons work

# Notes

Setting up fonts:

https://www.youtube.com/watch?v=fVoEojORQyQ

Network detection in simulator is flackey. Apparently works in real app.

https://reactnative.dev/docs/running-on-device

```
cd ios
open MusakBoxNative.xcworkspace
```
(trying to install from xcodeproject fails...)

Had to set the target version to 11

Had to go into iphone settings -> general -> device management
and approve my cert after the app had been pushed to trust myself.


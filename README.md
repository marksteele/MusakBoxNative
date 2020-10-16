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
* Client side caching. Currently all streaming.
* Make it pretty. It's ugly, but it works...


# Notes

Setting up fonts:

https://www.youtube.com/watch?v=fVoEojORQyQ

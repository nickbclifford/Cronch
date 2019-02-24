# Cronch Mobile

The mobile app for students.

# Setup

Copy `./Config.example.ts` into its own file `./Config.ts`. **Do not modify the `Config.example.ts` and instead put the proper credentials in this new file.** This new `Config.ts` is in the `.gitignore`, so credentials will not be committed.

```
$ npm install
$ npm start
```

# Debugging

## Problem

Error while building:

```
Unable to resolve "./Amplitude" from "node_modules\expo\build\Expo.js"
```

## Solution

```
expo start -c
```

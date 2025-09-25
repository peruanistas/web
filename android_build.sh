#!/bin/bash

_notes="
keytool -genkeypair -v \
  -keystore debug-key.jks \
  -alias debug \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

pass: peruanista
"

key_name=debug-key.jks

export NDK_HOME="/opt/Android/Sdk/ndk/27.2.12479018/"
export ANDROID_HOME="/opt/Android/Sdk/"

npm run tauri android build --apk

OUTPUT_APK=./src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk
OUTPUT_AAB=./src-tauri/gen/android/app/build/outputs/bundle/universalRelease/app-universal-release.aab

zipalign=$ANDROID_HOME/build-tools/35.0.0/zipalign
apksigner=$ANDROID_HOME/build-tools/35.0.0/apksigner

$zipalign -v -p 4 $OUTPUT_APK app-aligned.apk

# pass
$apksigner sign \
  --ks $key_name \
  --ks-key-alias debug \
  --out app-signed.apk \
  app-aligned.apk

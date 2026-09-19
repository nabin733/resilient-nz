# Resilient NZ — Mobile App

An offline-first React Native app for New Zealand civil defence shelter information and emergency check-ins. Built to keep working even with no internet connection.

## Features

- Offline-first architecture — shelter data cached in local SQLite
- Emergency check-ins — save your status (OK / Need Help / SOS) with real GPS location, queued locally until sync
- Auto-sync — automatically uploads queued check-ins the moment internet is restored
- Live shelter map — shelters plotted on a map with open/closed status
- Real-time connectivity detection — visible offline banner when disconnected

## Tech Stack

- React Native (Expo SDK 57)
- expo-sqlite — local offline database
- expo-location — real GPS
- react-native-maps — shelter map view
- @react-navigation — screen navigation
- @react-native-community/netinfo — connectivity detection
- REST API integration with a Django backend

## Getting Started

npm install
npx expo start

Scan the QR code with Expo Go (iOS/Android) to run on your phone.

## Backend

This app expects a running instance of the companion Django backend: https://github.com/nabin733/resilient-backend

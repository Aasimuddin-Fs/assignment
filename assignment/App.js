/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import TrackPlayer, {Capability} from 'react-native-track-player';
import Home from './src/screens/Home';

const App = () => {
  useEffect(() => {
    setUpPlayer();
  }, []);

  const setUpPlayer = async () => {
    TrackPlayer.setupPlayer({
      waitForBuffer: true,
      iosCategory: 'playback',
      iosCategoryMode: 'moviePlayback',
    }).then(async () => {
      // The player is ready to be used
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        alwaysPauseOnInterruption: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: '#4842f5', flex: 1}}>
      <StatusBar barStyle={'dark-content'} />
      <Home />
    </SafeAreaView>
  );
};

export default App;

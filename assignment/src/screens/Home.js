import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import TrackPlayer from 'react-native-track-player';
import {tracks} from '../helper/musicTracks';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const Home = () => {
  const [tracksList, setTracksList] = useState(tracks);
  const [isAnyPlaying, setIsAnyPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({});

  const handlePlay = async track => {
    await TrackPlayer.reset();
    await TrackPlayer.add([track]);
    await TrackPlayer.play();
    setCurrentTrack(track);
    setIsAnyPlaying(true);
  };

  const handleToggle = async () => {
    if ((await TrackPlayer.getState()) === 'playing') {
      await TrackPlayer.pause();
      setIsAnyPlaying(false);
    }
  };

  const downloadFile = async (track, index) => {
    if (tracksList[index].url) {
      handlePlay(tracksList[index]);
      return;
    }
    let path = RNFetchBlob.fs.dirs.MusicDir;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp3',
      path: path + `/sound${index}.mp3`,
    })
      .fetch('GET', track)
      .progress((received, total) => {
        tracksList[index].downloaded = (received / total) * 100;
        setTracksList([...tracksList]);
      })
      .then(res => {
        tracksList[index].remoteUrl = '';
        tracksList[index].url = `file://${res.path()}`;
        tracksList[index].downloaded = 100;
        handlePlay(tracksList[index]);
        setTracksList([...tracksList]);
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
      });
  };

  const getColor = item => (!item.url ? '#fff' : '#4842f5');

  const renderList = (item, index) => (
    <View key={index} style={{flex: 1, alignItems: 'center'}}>
      <AnimatedCircularProgress
        size={60}
        width={5}
        fill={item.downloaded}
        tintColor={getColor(item)}
        style={{
          borderRadius: 50,
          backgroundColor: item.url ? '#fff' : '#4842f5',
        }}
        backgroundColor="#4842f5">
        {() => (
          <TouchableOpacity
            onPress={() => downloadFile(item.remoteUrl, index)}
            key={index}>
            <Icon
              name={item.icon}
              size={30}
              color={getColor(item)}
            />
          </TouchableOpacity>
        )}
      </AnimatedCircularProgress>
    </View>
  );

  return (
    <View style={styles.container}>
      {isAnyPlaying && (
        <TouchableOpacity onPress={handleToggle}>
          <IonIcon name="pause" size={100} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.currentText}>
        Current Song : {currentTrack?.title || '--'}
      </Text>
      <View style={styles.listContainer}>{tracksList.map(renderList)}</View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4842f5',
    flex: 1,
    borderColor: 'red',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  listContainer: {
    position: 'absolute',
    bottom: 10,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  currentText: {fontSize: 30, color: '#fff', fontWeight: 'bold'},
});

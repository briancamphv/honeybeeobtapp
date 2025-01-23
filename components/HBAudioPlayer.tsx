import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Icon, MD3Colors } from "react-native-paper"; // Adjust this import according to your UI component needs
import { useAppContext } from "@/context/AppContext";

import { PlayBackType } from "react-native-audio-recorder-player";

import RNFS from "react-native-fs";
import getMP3Duration from "react-native-get-mp3-duration";

interface AudioPlayerProps {
  audioUri: string[];
  progressCallBack?: (status: string, index: number) => void
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri, progressCallBack }) => {
  const { audioPlayer, enableAudio, disableAudio, audioStop, playRecording } =
    useAppContext();

  useEffect(() => {
    if (audioStop) {
      // onStopPlay();
      setAudioLoaded(false);
      setPlaying(false);
      setCurrentPosition(0);

      enableAudio();
    }
  }, [audioStop]);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const [playing, setPlaying] = useState<boolean>(false);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  var currentAudioIndex: number = 0;
  var progress: number = 0;

  const handleSliderValueChange = async (value: number) => {
    if (audioLoaded) {
      setPlaying(false);
      await audioPlayer.seekToPlayer(value);
    }
  };

  const playNextAudio = async () => {
    currentAudioIndex++;
    if (currentAudioIndex < audioUri.length) {
      audioPlayer.stopPlayer().then(() => {
        audioPlayer.startPlayer(audioUri[currentAudioIndex]);
      });

      progressCallBack ? progressCallBack("inProgress",currentAudioIndex) : ""


    } else {
      setAudioLoaded(false);
      setPlaying(false);
      setCurrentPosition(0);
      
      progressCallBack ? progressCallBack("finished",currentAudioIndex) : ""

    }
  };

  const onPlaybackStatusUpdate = (status: PlayBackType) => {
    if (playRecording) {
      return;
    }

    // setDuration(status.duration || 0);
    setCurrentPosition(status.currentPosition + progress || 0);

    if (status.isFinished) {
      progress = progress + status.currentPosition;
      playNextAudio();
    }
  };

  const onStartPlay = async () => {
    audioUri.map((audio) => {
      RNFS.readFile(audio, "base64").then((base64) =>
        getMP3Duration(base64).then((duration) =>
          setDuration((prev) => prev + duration)
        )
      );
    });

    disableAudio();
    enableAudio();
    setPlaying(true);
    setAudioLoaded(true);

    setTimeout(() => {
      audioPlayer.addPlayBackListener((status) => {
        onPlaybackStatusUpdate(status);
      });
      audioPlayer.startPlayer(audioUri[currentAudioIndex]);
    }, 5); // 1000 milliseconds = 1 second
  };

  const onPausePlay = async () => {
    await audioPlayer.pausePlayer();
  };

  const onResumePlay = async () => {
    await audioPlayer.resumePlayer();
  };

  const onStopPlay = async () => {
    await audioPlayer.stopPlayer();
  };

  const onPlayPause = async () => {
    if (audioLoaded) {
      if (playing) {
        await onPausePlay();
      } else {
        await onResumePlay();
      }
      setPlaying(!playing);
    } else {
      onStartPlay();
    }
  };

  return (
    <View style={{ padding: 10, flexDirection: "row", width: "90%" }}>
      <TouchableOpacity disabled={!audioPlayer} onPress={onPlayPause}>
        <Icon
          source={playing ? "pause" : "play"}
          color={MD3Colors.error50}
          size={35}
        />
      </TouchableOpacity>

      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={duration || 0}
        value={currentPosition || 0}
        onSlidingComplete={handleSliderValueChange}
        onSlidingStart={onPausePlay}
        disabled={!audioPlayer}
      />
    </View>
  );
};

export default AudioPlayer;

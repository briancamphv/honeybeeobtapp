import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Icon, MD3Colors } from "react-native-paper"; // Adjust this import according to your UI component needs
import { useAppContext } from "@/context/AppContext";

import AudioRecorderPlayer, {
  PlayBackType,
} from "react-native-audio-recorder-player";

const audioPlayer = new AudioRecorderPlayer();

interface AudioPlayerProps {
  audioUri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri }) => {
  const { enableAudio, audioStop, playRecording } = useAppContext();

  useEffect(() => {
    if (audioStop) {
      onStopPlay();
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

  const handleSliderValueChange = async (value: number) => {
    if (audioLoaded) {
      setPlaying(false);
      await audioPlayer.seekToPlayer(value);
    }
  };

  audioPlayer.addPlayBackListener((status) => onPlaybackStatusUpdate(status));

  const onPlaybackStatusUpdate = (status: PlayBackType) => {
    if (playRecording) {
      return;
    }

    setDuration(status.duration || 0);
    setCurrentPosition(status.currentPosition || 0);

    if (status.isFinished) {
      setAudioLoaded(false);
      setPlaying(false);
      setCurrentPosition(0);
    }
  };

  const onStartPlay = async () => {
    const msg = await audioPlayer.startPlayer(audioUri);
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
      setPlaying(true);
      setAudioLoaded(true);
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

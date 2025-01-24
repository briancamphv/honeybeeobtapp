import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { Icon, MD3Colors } from "react-native-paper";
import { useState, useEffect, useRef } from "react";

import { useAppContext } from "@/context/AppContext";
const { width: screenWidth } = Dimensions.get("screen");

interface props {
  videoURI: string;
}

const HBVideo: React.FC<props> = ({ videoURI }) => {
 
  const [videoHeight, setVideoHeigth] = useState<number>(0);
  const [videoWidth, setVideoWidth] = useState<number>(0);

  const videoRef = useRef<VideoView>(null);

  useEffect(() => {
    const videoWidth = screenWidth - 100
    setVideoWidth(videoWidth);
    setVideoHeigth(videoWidth/ 1.777);
  }, []);

  const player = useVideoPlayer(videoURI, (player) => {
    player.loop = true;

    
    player.play();

    setTimeout(() => {
      player.pause();
    }, 1000);
    
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleFullscreen = async () => {
    try {
      await videoRef!.current?.enterFullscreen(); 
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={videoRef}
        style={[styles.video, { width: videoWidth, height: videoHeight }]}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
      {/* <View style={styles.controlsContainer}>
        <TouchableOpacity
          disabled={false}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        >
          <Icon
            source={isPlaying ? "pause" : "play"}
            color={MD3Colors.error50}
            size={35}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={false}
          onPress={handleFullscreen}
        >
          <Icon
            source={"fullscreen"}
            color={MD3Colors.error50}
            size={35}
          />
        </TouchableOpacity>  */}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    flex: 1,
  },
  controlsContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
});

export default HBVideo;

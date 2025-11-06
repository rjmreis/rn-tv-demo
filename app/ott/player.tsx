import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
  BackHandler,
  useTVEventHandler,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Video, { VideoRef } from "react-native-video";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useCatalog } from "@/hooks/useCatalog";
import { useScale } from "@/hooks/useScale";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFormatters } from "@/hooks/useFormatters";

export default function PlayerScreen() {
  const videoRef = useRef<VideoRef>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const { catalog } = useCatalog();
  const { formatTime } = useFormatters();
  const router = useRouter();
  const scale = useScale();

  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const tintColor = useThemeColor({}, "tint");

  const item = catalog.find((i) => i.id === id);

  const showOverlaysTemporarily = () => {
    setShowOverlays(true);
  };

  // Handle TV remote events
  useTVEventHandler((evt: any) => {
    if (evt && evt.eventType === "select") {
      // Toggle play/pause on Enter/Select button
      setPaused((prev) => !prev);
      showOverlaysTemporarily();
    } else if (evt && evt.eventType === "playPause") {
      // Handle play/pause button on remote
      setPaused((prev) => !prev);
      showOverlaysTemporarily();
    }
  });

  // Handle Android back button and TV back button
  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [router]);

  useEffect(() => {
    // Start the hide timer when component mounts or when overlays are shown
    if (showOverlays) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        setShowOverlays(false);
      }, 5000);
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [showOverlays]);

  if (!item) {
    return (
      <ThemedView style={styles(scale).container}>
        <ThemedText style={styles(scale).errorMessage}>
          Video not found
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <Pressable
      style={styles(scale).container}
      onPress={showOverlaysTemporarily}
      focusable={!error && !loading}
    >
      <Video
        ref={videoRef}
        source={{ uri: item.streamUrl }}
        style={styles(scale).video}
        paused={paused}
        controls={false}
        resizeMode="contain"
        volume={1.0}
        muted={false}
        audioOutput="speaker"
        ignoreSilentSwitch="ignore"
        onLoad={(data) => {
          setLoading(false);
          setDuration(data.duration);
        }}
        onProgress={(data) => {
          setCurrentTime(data.currentTime);
        }}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        onEnd={() => router.back()}
        testID="video-player"
      />
      {loading && (
        <View style={styles(scale).loadingOverlay}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={{ marginTop: 16 * scale, color: "#fff" }}>
            Loading video...
          </ThemedText>
        </View>
      )}
      {error && (
        <View style={styles(scale).loadingOverlay}>
          <ThemedText style={styles(scale).errorIcon}>⚠</ThemedText>
          <ThemedText style={styles(scale).errorTitle}>
            Unable to Load Video
          </ThemedText>
          <ThemedText style={styles(scale).errorMessage}>
            We couldn&apos;t load this video. Please check your connection and
            try again.
          </ThemedText>
          <Pressable
            style={({ focused }) => [
              styles(scale).backButton,
              focused && styles(scale).backButtonFocused,
            ]}
            onPress={() => router.back()}
            hasTVPreferredFocus={true}
            testID="error-back-button"
          >
            <ThemedText style={styles(scale).backButtonText}>
              Go Back
            </ThemedText>
          </Pressable>
        </View>
      )}

      {showOverlays && (
        <ThemedView style={styles(scale).overlayInfo}>
          <ThemedText style={styles(scale).title} testID="player-title">
            {item.title}
          </ThemedText>
          <View style={styles(scale).progressContainer}>
            <ThemedText style={styles(scale).timeText}>
              {formatTime(currentTime)}
            </ThemedText>
            <View style={styles(scale).progressBarContainer}>
              <View style={styles(scale).progressBarBackground} />
              <View
                style={[
                  styles(scale).progressBarFill,
                  {
                    width: `${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%`,
                    backgroundColor: tintColor,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles(scale).timeText}>
              {formatTime(duration)}
            </ThemedText>
          </View>
          <ThemedText style={styles(scale).statusText}>
            {paused ? "⏸ Paused" : "▶ Playing"}
          </ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = (scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    video: {
      ...StyleSheet.absoluteFillObject,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
      zIndex: 10,
    },
    overlayInfo: {
      position: "absolute",
      bottom: 40 * scale,
      left: 20 * scale,
      right: 20 * scale,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 16 * scale,
      borderRadius: 8 * scale,
    },
    title: {
      fontSize: 24 * scale,
      fontWeight: "bold",
      color: "#fff",
    },
    statusText: {
      fontSize: 16 * scale,
      color: "#fff",
      opacity: 0.8,
      marginTop: 8 * scale,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16 * scale,
      gap: 12 * scale,
    },
    progressBarContainer: {
      flex: 1,
      height: 6 * scale,
      position: "relative",
      borderRadius: 3 * scale,
      overflow: "hidden",
    },
    progressBarBackground: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.3)",
    },
    progressBarFill: {
      position: "absolute",
      height: "100%",
      borderRadius: 3 * scale,
    },
    timeText: {
      fontSize: 14 * scale,
      color: "#fff",
      fontVariant: ["tabular-nums"],
      minWidth: 40 * scale,
      textAlign: "center",
    },
    errorIcon: {
      fontSize: 48 * scale,
      textAlign: "center",
      marginBottom: 16 * scale,
      opacity: 0.8,
    },
    errorTitle: {
      fontSize: 24 * scale,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
      marginBottom: 12 * scale,
    },
    errorMessage: {
      fontSize: 16 * scale,
      color: "#fff",
      textAlign: "center",
      opacity: 0.7,
      marginBottom: 24 * scale,
      maxWidth: 400 * scale,
    },
    backButton: {
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 32 * scale,
      paddingVertical: 12 * scale,
      borderRadius: 8 * scale,
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.3)",
    },
    backButtonFocused: {
      backgroundColor: "rgba(255,255,255,0.25)",
      borderColor: "#fff",
      transform: [{ scale: 1.05 }],
    },
    backButtonText: {
      fontSize: 18 * scale,
      fontWeight: "600",
      color: "#fff",
      textAlign: "center",
    },
  });

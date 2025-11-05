import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
  Platform,
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

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { catalog } = useCatalog();
  const router = useRouter();
  const scale = useScale();
  const videoRef = useRef<VideoRef>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
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
        <ThemedText style={styles(scale).errorText}>Video not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <Pressable
      style={styles(scale).container}
      onPress={showOverlaysTemporarily}
    >
      <Video
        ref={videoRef}
        source={{ uri: item.streamUrl }}
        style={styles(scale).video}
        paused={paused}
        controls={false}
        resizeMode="contain"
        volume={4.0}
        muted={false}
        audioOutput="speaker"
        ignoreSilentSwitch="ignore"
        onLoad={() => setLoading(false)}
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
          <ThemedText style={styles(scale).errorText}>
            Error loading video. Please try again.
          </ThemedText>
        </View>
      )}

      {showOverlays && (
        <ThemedView style={styles(scale).overlayInfo}>
          <ThemedText style={styles(scale).title} testID="player-title">
            {item.title}
          </ThemedText>
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
    errorText: {
      fontSize: 16 * scale,
      color: "red",
      textAlign: "center",
    },
  });

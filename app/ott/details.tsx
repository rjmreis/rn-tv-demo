import { StyleSheet, Image, Pressable, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useCatalog } from '@/hooks/useCatalog';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFormatters } from '@/hooks/useFormatters';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { catalog } = useCatalog();
  const router = useRouter();
  const navigation = useNavigation();
  const scale = useScale();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const { formatDuration } = useFormatters();

  const item = catalog.find((i) => i.id === id);

  // Set the navigation title to the movie name
  useEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.title,
      });
    }
  }, [item, navigation]);

  if (!item) {
    return (
      <ThemedView style={styles(scale).container}>
        <ThemedText style={styles(scale).errorText}>Item not found</ThemedText>
      </ThemedView>
    );
  }

  const handlePlayPress = () => {
    router.push({
      pathname: '/ott/player',
      params: { id: item.id },
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const dynamicStyles = StyleSheet.create({
    playButton: {
      backgroundColor: tintColor,
      paddingVertical: 18 * scale,
      paddingHorizontal: 40 * scale,
      borderRadius: 8 * scale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButtonFocused: {
      backgroundColor: tintColor,
      paddingVertical: 18 * scale,
      paddingHorizontal: 40 * scale,
      borderRadius: 8 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: 1.05 }],
      borderWidth: 3,
      borderColor: '#fff',
    },
    playButtonText: {
      color: backgroundColor,
      fontSize: 20 * scale,
      fontWeight: 'bold',
    },
    backButton: {
      backgroundColor: '#333',
      paddingVertical: 18 * scale,
      paddingHorizontal: 40 * scale,
      borderRadius: 8 * scale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonFocused: {
      backgroundColor: '#333',
      paddingVertical: 18 * scale,
      paddingHorizontal: 40 * scale,
      borderRadius: 8 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: 1.05 }],
      borderWidth: 3,
      borderColor: tintColor,
    },
    backButtonText: {
      color: textColor,
      fontSize: 20 * scale,
      fontWeight: '600',
    },
  });

  return (
    <ThemedView style={styles(scale).container}>
      <ThemedView style={styles(scale).content}>
        <ThemedView style={styles(scale).posterContainer}>
          <Image
            source={{ uri: item.poster || item.thumbnail }}
            style={styles(scale).poster}
            resizeMode="cover"
            testID="details-poster"
          />
        </ThemedView>
        <ThemedView style={styles(scale).detailsContainer}>
          <ThemedText style={styles(scale).title} testID="details-title">
            {item.title}
          </ThemedText>
          <ThemedView style={styles(scale).metaContainer}>
            {item.genre && (
              <>
                <ThemedText style={styles(scale).meta}>{item.genre}</ThemedText>
                <ThemedText style={styles(scale).meta}> • </ThemedText>
              </>
            )}
            <ThemedText style={styles(scale).meta}>{formatDuration(item.duration)}</ThemedText>
          </ThemedView>
          <ThemedText style={styles(scale).description} numberOfLines={6} testID="details-description">
            {item.description}
          </ThemedText>
          <ThemedView style={styles(scale).buttonContainer}>
            <Pressable
              onPress={handlePlayPress}
              style={({ focused }) =>
                focused ? dynamicStyles.playButtonFocused : dynamicStyles.playButton
              }
              testID="play-button"
            >
              <ThemedText style={dynamicStyles.playButtonText}>▶ Play</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleBackPress}
              style={({ focused }) =>
                focused ? dynamicStyles.backButtonFocused : dynamicStyles.backButton
              }
              testID="back-button"
            >
              <ThemedText style={dynamicStyles.backButtonText}>← Back</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = (scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 20 * scale,
      paddingTop: Platform.isTV ? 40 * scale : 20 * scale,
      flexDirection: 'row',
      gap: 40 * scale,
    },
    posterContainer: {
      width: 350 * scale,
    },
    poster: {
      width: 350 * scale,
      height: 525 * scale,
      borderRadius: 12 * scale,
    },
    detailsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 40 * scale,
      fontWeight: 'bold',
      lineHeight: 48 * scale,
      marginBottom: 16 * scale,
    },
    metaContainer: {
      flexDirection: 'row',
      marginBottom: 20 * scale,
    },
    meta: {
      fontSize: 18 * scale,
      opacity: 0.7,
    },
    description: {
      fontSize: 18 * scale,
      lineHeight: 28 * scale,
      marginBottom: 32 * scale,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 16 * scale,
    },
    errorText: {
      fontSize: 18 * scale,
      color: 'red',
      textAlign: 'center',
      marginTop: 40 * scale,
    },
  });

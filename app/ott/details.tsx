import { StyleSheet, Image, Pressable, Platform, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { BackgroundImage } from '@/components/BackgroundImage';
import { useCatalog } from '@/hooks/useCatalog';
import { useScale } from '@/hooks/useScale';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFormatters } from '@/hooks/useFormatters';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { catalog } = useCatalog();
  const router = useRouter();
  const scale = useScale();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const { formatDuration } = useFormatters();

  const item = catalog.find((i) => i.id === id);

  if (!item) {
    return (
      <BackgroundImage>
        <View style={styles(scale).container}>
          <ThemedText style={styles(scale).errorText}>Item not found</ThemedText>
        </View>
      </BackgroundImage>
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
      borderWidth: 3,
      borderColor: 'transparent',
    },
    playButtonFocused: {
      backgroundColor: tintColor,
      paddingVertical: 18 * scale,
      paddingHorizontal: 40 * scale,
      borderRadius: 8 * scale,
      alignItems: 'center',
      justifyContent: 'center',
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
      borderWidth: 3,
      borderColor: 'transparent',
    },
    backButtonFocused: {
      backgroundColor: '#333',
      paddingVertical: 18 * scale,
      paddingHorizontal: 40 * scale,
      borderRadius: 8 * scale,
      alignItems: 'center',
      justifyContent: 'center',
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
    <BackgroundImage>
      <View style={styles(scale).container}>
        <View style={styles(scale).content}>
          <View style={styles(scale).posterContainer}>
            <Image
              source={{ uri: item.poster || item.thumbnail }}
              style={styles(scale).poster}
              resizeMode="cover"
              testID="details-poster"
            />
          </View>
          <View style={styles(scale).detailsContainer}>
            <ThemedText style={styles(scale).title} testID="details-title">
              {item.title}
            </ThemedText>
            <View style={styles(scale).metaContainer}>
              {item.genre && (
                <>
                  <ThemedText style={styles(scale).meta}>{item.genre}</ThemedText>
                  <ThemedText style={styles(scale).meta}> • </ThemedText>
                </>
              )}
              <ThemedText style={styles(scale).meta}>{formatDuration(item.duration)}</ThemedText>
            </View>
            <ThemedText style={styles(scale).description} numberOfLines={6} testID="details-description">
              {item.description}
            </ThemedText>
            <View style={styles(scale).buttonContainer}>
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
            </View>
          </View>
        </View>
      </View>
    </BackgroundImage>
  );
}

const styles = (scale: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    content: {
      padding: 20 * scale,
      paddingTop: Platform.isTV ? 40 * scale : 20 * scale,
      flexDirection: 'row',
      gap: 40 * scale,
      backgroundColor: 'transparent',
    },
    posterContainer: {
      width: 350 * scale,
      backgroundColor: 'transparent',
    },
    poster: {
      width: 350 * scale,
      height: 500 * scale,
      borderRadius: 12 * scale,
    },
    detailsContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent',
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
      backgroundColor: 'transparent',
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
      gap: 20 * scale,
      backgroundColor: 'transparent',
    },
    errorText: {
      fontSize: 18 * scale,
      color: 'red',
      textAlign: 'center',
      marginTop: 40 * scale,
    },
  });

import {
  StyleSheet,
  Pressable,
  Image,
  Platform,
  TVFocusGuideView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CatalogItem } from "@/types/catalog";
import { useScale } from "@/hooks/useScale";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CatalogTileProps {
  item: CatalogItem;
  onPress: () => void;
  onFocus?: () => void;
  trapFocusRight?: boolean;
  trapFocusDown?: boolean;
  testID?: string;
}

export function CatalogTile({
  item,
  onPress,
  onFocus,
  trapFocusRight,
  trapFocusDown,
  testID,
}: CatalogTileProps) {
  const scale = useScale();
  const highlightColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  const styles = StyleSheet.create({
    container: {
      margin: 16 * scale,
      width: 180 * scale,
    },
    pressable: {
      borderWidth: 4,
      borderColor: "transparent",
      borderRadius: 8 * scale,
      overflow: "hidden",
    },
    pressableFocused: {
      borderWidth: 4,
      borderColor: highlightColor,
      borderRadius: 8 * scale,
      overflow: "hidden",
      transform: Platform.isTV ? [{ scale: 1.05 }] : [],
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 12,
    },
    thumbnail: {
      width: "100%",
      height: 240 * scale,
      backgroundColor: "#333",
    },
    titleContainer: {
      padding: 8 * scale,
      backgroundColor: backgroundColor,
      minHeight: 50 * scale,
    },
    title: {
      fontSize: 14 * scale,
      fontWeight: "600",
    },
    genre: {
      fontSize: 12 * scale,
      opacity: 0.7,
      marginTop: 4 * scale,
    },
  });

  const content = (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      style={({ focused }) =>
        focused ? styles.pressableFocused : styles.pressable
      }
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.title}
        </ThemedText>
        {item.genre && (
          <ThemedText style={styles.genre}>{item.genre}</ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container} testID={testID}>
      {Platform.isTV && (trapFocusRight || trapFocusDown) ? (
        <TVFocusGuideView
          trapFocusRight={trapFocusRight || false}
          trapFocusDown={trapFocusDown || false}
        >
          {content}
        </TVFocusGuideView>
      ) : (
        content
      )}
    </ThemedView>
  );
}

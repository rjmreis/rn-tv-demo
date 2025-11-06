import {
  StyleSheet,
  Pressable,
  Image,
  Platform,
  TVFocusGuideView,
  View,
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
      borderWidth: 3,
      borderColor: highlightColor,
      borderRadius: 8 * scale,
      overflow: "hidden",
      transform: [{ scale: 1.05 }],
    },
    thumbnail: {
      width: "100%",
      height: 200 * scale,
      backgroundColor: "#333",
      borderTopLeftRadius: 4 * scale,
      borderTopRightRadius: 4 * scale,
    },
    thumbnailFocused: {
      width: "100%",
      height: 200 * scale,
      backgroundColor: "#333",
      borderTopLeftRadius: 5 * scale,
      borderTopRightRadius: 5 * scale,
    },
    titleContainer: {
      padding: 8 * scale,
      backgroundColor: backgroundColor,
      minHeight: 50 * scale,
      borderBottomLeftRadius: 4 * scale,
      borderBottomRightRadius: 4 * scale,
      opacity: 0.7,
    },
    titleContainerFocused: {
      padding: 8 * scale,
      backgroundColor: backgroundColor,
      minHeight: 50 * scale,
      borderBottomLeftRadius: 5 * scale,
      borderBottomRightRadius: 5 * scale,
      opacity: 1,
    },
    title: {
      fontSize: 14 * scale,
      fontWeight: "600",
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
      {({ focused }) => (
        <>
          <Image
            source={{ uri: item.thumbnail }}
            style={focused ? styles.thumbnailFocused : styles.thumbnail}
            resizeMode="cover"
          />
          <ThemedView style={focused ? styles.titleContainerFocused : styles.titleContainer}>
            <ThemedText style={styles.title} numberOfLines={2}>
              {item.title}
            </ThemedText>
          </ThemedView>
        </>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container} testID={testID}>
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
    </View>
  );
}

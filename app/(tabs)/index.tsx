import { useRef, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { CatalogTile } from "@/components/CatalogTile";
import { BackgroundImage } from "@/components/BackgroundImage";
import { useCatalog } from "@/hooks/useCatalog";
import { useScale } from "@/hooks/useScale";
import { CatalogItem } from "@/types/catalog";

// Total tile height: margin-top(16) + thumbnail(240) + titleContainer(padding 8*2 + minHeight 50) + margin-bottom(16)
const TILE_HEIGHT = 16 + 240 + 66 + 16; // = 338

export default function HomeScreen() {
  const { catalog, loading, error } = useCatalog();
  const router = useRouter();
  const scale = useScale();
  const flatListRef = useRef<FlatList>(null);
  const lastFocusedRow = useRef<number>(0);

  const styles = StyleSheet.create({
    header: {
      padding: 20 * scale,
      paddingTop: Platform.OS === "ios" ? 60 * scale : 40 * scale,
      backgroundColor: "transparent",
    },
    title: {
      fontSize: 32 * scale,
      fontWeight: "bold",
      lineHeight: 40 * scale,
    },
    subtitle: {
      fontSize: 16 * scale,
      lineHeight: 24 * scale,
      opacity: 0.7,
      marginTop: 8 * scale,
    },
    listContainer: {
      padding: 12 * scale,
      paddingBottom: 50 * scale,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    errorText: {
      fontSize: 16 * scale,
      color: "red",
    },
  });

  const handleItemPress = useCallback(
    (item: CatalogItem) => {
      router.push({
        pathname: "/ott/details",
        params: { id: item.id },
      });
    },
    [router]
  );

  const handleItemFocus = useCallback(
    (index: number) => {
      if (Platform.isTV && flatListRef.current && catalog.length > 0) {
        const numColumns = Platform.isTV ? 4 : 2;
        const rowIndex = Math.floor(index / numColumns);
        const totalRows = Math.ceil(catalog.length / numColumns);

        // Only scroll if the row has actually changed (not just horizontal movement)
        if (rowIndex === lastFocusedRow.current) {
          return; // Same row, no need to scroll
        }

        // Determine scroll direction
        const movingDown = rowIndex > lastFocusedRow.current;
        lastFocusedRow.current = rowIndex;

        try {
          // Use scrollToOffset instead of scrollToIndex for more control
          const rowHeight = TILE_HEIGHT * scale;
          const headerHeight = (40 + 32 + 8 + 16) * scale; // paddingTop + title + subtitle + marginTop
          let targetOffset;

          if (movingDown) {
            // When moving down, ensure the focused row is fully visible
            // Add extra space for the last row to show focus effects
            if (rowIndex === totalRows - 1) {
              // Last row: scroll more to show focus effects at bottom
              targetOffset = Math.max(
                0,
                headerHeight + rowIndex * rowHeight - 50 * scale
              );
            } else {
              // Other rows: standard scroll
              targetOffset = Math.max(
                0,
                headerHeight + rowIndex * rowHeight - 100 * scale
              );
            }
          } else {
            // When moving up, position row higher on screen
            targetOffset = Math.max(
              0,
              headerHeight + (rowIndex - 1) * rowHeight
            );
          }

          flatListRef.current.scrollToOffset({
            offset: targetOffset,
            animated: true,
          });
        } catch (error) {
          if (__DEV__) {
            console.log("ScrollToOffset error:", error);
          }
        }
      }
    },
    [catalog.length, scale]
  );

  const getItemLayout = useCallback(
    (_data: any, index: number) => {
      const numColumns = Platform.isTV ? 4 : 2;
      const rowIndex = Math.floor(index / numColumns);
      return {
        length: TILE_HEIGHT * scale,
        offset: TILE_HEIGHT * scale * rowIndex,
        index,
      };
    },
    [scale]
  );

  const keyExtractor = useCallback((item: CatalogItem) => item.id, []);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <ThemedText style={styles.title}>Featured Content</ThemedText>
        <ThemedText style={styles.subtitle}>
          Browse our collection of {catalog.length} titles
        </ThemedText>
      </View>
    ),
    [catalog.length, styles.header, styles.subtitle, styles.title]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CatalogItem; index: number }) => {
      const numColumns = Platform.isTV ? 4 : 2;
      const totalRows = Math.ceil(catalog.length / numColumns);
      const rowIndex = Math.floor(index / numColumns);
      const remainder = catalog.length % numColumns;

      // Check if this item is in the last row
      const isInLastRow = Platform.isTV && rowIndex === totalRows - 1;

      // Check if this is the last item in an incomplete last row
      const isLastInIncompleteRow =
        Platform.isTV && remainder !== 0 && index === catalog.length - 1;

      return (
        <CatalogTile
          item={item}
          onPress={() => handleItemPress(item)}
          onFocus={() => handleItemFocus(index)}
          trapFocusRight={isLastInIncompleteRow}
          trapFocusDown={isInLastRow}
          testID={`catalog-item-${item.id}`}
        />
      );
    },
    [catalog.length, handleItemPress, handleItemFocus]
  );

  if (loading) {
    return (
      <BackgroundImage>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={{ marginTop: 16 * scale }}>
            Loading catalog...
          </ThemedText>
        </View>
      </BackgroundImage>
    );
  }

  if (error) {
    return (
      <BackgroundImage>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.errorText}>
            Error loading catalog: {error.message}
          </ThemedText>
        </View>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <FlatList
        ref={flatListRef}
        data={catalog}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={Platform.isTV ? 4 : 2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        getItemLayout={getItemLayout}
        testID="catalog-list"
      />
    </BackgroundImage>
  );
}

import { Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { useTextStyles } from "@/hooks/useTextStyles";
import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * This layout is required for the web platform.
 */
export default function TabLayout() {
  const textStyles = useTextStyles();

  const tabBarButton = (props: any) => {
    return <Pressable {...props} />;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: useThemeColor({}, "text"),
        tabBarInactiveTintColor: useThemeColor({}, "tint"),
        tabBarActiveBackgroundColor: useThemeColor({}, "backgroundSecondary"),
        tabBarStyle: {
          width: "100%",
        },
        tabBarPosition: "top",
        tabBarIconStyle: {
          height: textStyles.title.lineHeight,
          width: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "RN TV Demo",
          tabBarButton,
          tabBarLabelStyle: textStyles.default,
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}

import { Stack } from 'expo-router';

export default function OTTLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="player"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </Stack>
  );
}

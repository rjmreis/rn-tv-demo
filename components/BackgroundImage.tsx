import { StyleSheet, ImageBackground, View } from 'react-native';
import { ReactNode } from 'react';

interface BackgroundImageProps {
  children: ReactNode;
}

export function BackgroundImage({ children }: BackgroundImageProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={styles.background}
        resizeMode="cover"
        imageStyle={styles.image}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000', // Pure black background behind the image
  },
  image: {
    opacity: 0.5, // Slightly higher opacity for better visibility
  },
});

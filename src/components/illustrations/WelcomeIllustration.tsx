import React from 'react';
import { Image } from 'react-native';

export default function WelcomeIllustration({ width = 300, height = 300 }: { width?: number; height?: number }) {
  return (
    <Image 
      source={require('../../../assets/images/image.png')} 
      style={{ width, height, resizeMode: 'contain' }} 
    />
  );
}

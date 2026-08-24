import React from 'react';
import { Image } from 'react-native';

export default function LighthouseIllustration({ width = 300, height = 300 }: { width?: number; height?: number }) {
  return (
    <Image 
      source={require('../../../assets/images/image copy.png')} 
      style={{ width, height, resizeMode: 'contain' }} 
    />
  );
}

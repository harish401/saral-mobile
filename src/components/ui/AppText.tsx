import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { colors, typography } from '../../theme/theme';

export interface AppTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySecondary' | 'caption';
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return typography.h1;
      case 'h2':
        return typography.h2;
      case 'h3':
        return typography.h3;
      case 'bodySecondary':
        return typography.bodySecondary;
      case 'caption':
        return typography.caption;
      case 'body':
      default:
        return typography.body;
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        color ? { color } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;

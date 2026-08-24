import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';

export interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  variant = 'elevated',
  ...props
}) => {
  return (
    <View style={[styles.card, styles[variant], style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  flat: {
    backgroundColor: '#f8fafc',
  },
});

export default AppCard;

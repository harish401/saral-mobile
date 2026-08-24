import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { AppText } from './AppText';
import { colors, spacing, borderRadius } from '../../theme/theme';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const showLoading = loading || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || showLoading}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      {showLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : colors.primary} />
      ) : (
        <>
          {icon}
          <AppText
            style={[
              styles.text,
              styles[`${variant}Text`],
              styles[`${size}Text`],
              disabled && styles.disabledText,
              icon ? { marginLeft: 8 } : null,
              textStyle,
            ]}
          >
            {title}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: '#e2e8f0',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  disabled: {
    backgroundColor: '#cbd5e1',
    borderColor: '#cbd5e1',
  },
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: colors.text,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#94a3b8',
  },
});

export default AppButton;

export const colors = {
  // Primary brand colors
  primary: '#10b981', // Emerald green
  primaryLight: '#34d399',
  primaryDark: '#059669',
  
  // Neutral/Background colors
  background: '#f8fafc',
  surface: '#ffffff',
  
  // Text colors
  text: '#1e293b',
  textSecondary: '#64748b',
  textLight: '#94a3b8',
  textInverse: '#ffffff',
  
  // Status colors
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Borders
  border: '#e2e8f0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: colors.text,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    color: colors.textLight,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
};

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../../theme/theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 5 }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        
        return (
          <React.Fragment key={stepNum}>
            <View style={[styles.circle, isActive && styles.activeCircle]}>
              <AppText 
                variant="body" 
                color={isActive ? colors.surface : colors.text}
                style={styles.stepText}
              >
                {stepNum}
              </AppText>
            </View>
            {stepNum < totalSteps && (
              <View style={styles.line} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeCircle: {
    backgroundColor: '#74B686',
    borderColor: '#74B686',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -2,
    zIndex: 1,
  },
});

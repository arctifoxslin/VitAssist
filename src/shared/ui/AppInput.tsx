import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { COLORS } from './theme/colors';

interface Props extends TextInputProps {
  label?: string
  error?: string
}

export const AppInput = ({ label, error, style, ...rest }: Props) => {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="subtitle" style={styles.label}>
          {label}
        </AppText>
      )}

      <TextInput
        style={[
          styles.input,
          { borderColor: focused ? COLORS.primary : COLORS.border },
          error && { borderColor: COLORS.danger },
          style,
        ]}
        placeholderTextColor={COLORS.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />

      {error && (
        <AppText variant="small" color={COLORS.danger} style={styles.error}>
          {error}
        </AppText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },

  label: {
    marginBottom: 6,
    color: COLORS.textPrimary,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },

  error: {
    marginTop: 4,
  }
})

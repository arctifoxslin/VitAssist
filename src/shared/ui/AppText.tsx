import React from 'react';
import { Text, TextProps } from 'react-native';
import { COLORS } from './theme/colors';
import { TYPOGRAPHY } from './theme/typography';

type Variant = 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'small' | 'caption' | 'legend'

interface Props extends TextProps {
  variant?: Variant
  color?: string
}

export const AppText = ({
  variant = "body",
  color = COLORS.textPrimary,
  style,
  ...rest
}: Props) => {
  return (
    <Text style={[{ color }, TYPOGRAPHY[variant], style]}
      {...rest}
    />
  )
}
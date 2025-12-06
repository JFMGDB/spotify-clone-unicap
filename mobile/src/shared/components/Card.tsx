import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image, Text, ViewStyle, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({ title, subtitle, imageUrl, onPress, style }: CardProps) {
  const { width } = useWindowDimensions();
  
  const cardStyle = StyleSheet.flatten([styles.card, style]);
  const cardWidth = typeof cardStyle.width === 'number' 
    ? cardStyle.width 
    : width * 0.4;
  const imageHeight = Math.max(120, Math.min(200, cardWidth * 1.0));

  const content = (
    <View style={[styles.card, style]}>
      {imageUrl && (
        <Image 
          source={{ uri: imageUrl }} 
          style={[styles.image, { height: imageHeight }]} 
          resizeMode="cover" 
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});


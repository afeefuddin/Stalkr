import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Text from './text';

interface AvatarProps {
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

const AVATAR_COLORS = [
  ['#FF6B6B', '#FF8E53'],
  ['#4ECDC4', '#44A08D'],
  ['#45B7D1', '#96C93F'],
  ['#F093FB', '#F5576C'],
  ['#4FACFE', '#00F2FE'],
  ['#43E97B', '#38F9D7'],
  ['#FA709A', '#FEE140'],
  ['#A8EDEA', '#FED6E3'],
  ['#FFD89B', '#19547B'],
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#ffecd2', '#fcb69f'],
  ['#a8edea', '#fed6e3'],
  ['#ffd0a6', '#fd9853'],
];

const getColorIndex = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
};

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  style,
  textColor = '#FFFFFF',
}) => {
  const colorIndex = getColorIndex(name);
  const [primaryColor, secondaryColor] = AVATAR_COLORS[colorIndex];
  const initial = getInitial(name);
  const fontSize = size * 0.4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: primaryColor,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.gradientOverlay,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: secondaryColor,
          },
        ]}
      />

      <Text
        style={[
          styles.initial,
          {
            fontSize,
            color: textColor,
          },
        ]}
        weight="600"
      >
        {initial}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  gradientOverlay: {
    position: 'absolute',
    opacity: 0.7,
  },
  initial: {
    textAlign: 'center',
    fontWeight: '600',
    zIndex: 1,
  },
});

export default Avatar;

export const SmallAvatar: React.FC<
  Omit<AvatarProps, 'size'> & { size?: number }
> = props => <Avatar {...props} size={props.size || 24} />;

export const MediumAvatar: React.FC<
  Omit<AvatarProps, 'size'> & { size?: number }
> = props => <Avatar {...props} size={props.size || 40} />;

export const LargeAvatar: React.FC<
  Omit<AvatarProps, 'size'> & { size?: number }
> = props => <Avatar {...props} size={props.size || 64} />;

export const XLargeAvatar: React.FC<
  Omit<AvatarProps, 'size'> & { size?: number }
> = props => <Avatar {...props} size={props.size || 96} />;

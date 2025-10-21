import { Text as RnText, StyleProp, TextStyle } from 'react-native';
import Colors from '~/theme/colors';

const getStyleFromSize = (
  variant: 'default' | 'xl' | 'lg' | 'sm',
): StyleProp<TextStyle> => {
  const styleObj = {
    default: {
      fontSize: 16,
    },
    xl: {
      fontSize: 24,
    },
    lg: {
      fontSize: 20,
    },
    sm: {
      fontSize: 12,
    },
  };

  return styleObj[variant];
};

export default function Text({
  children,
  variant = 'default',
  style,
weight
}: {
  children: React.ReactNode;
  variant?: 'default' | 'xl' | 'lg' | 'sm';
  style?: StyleProp<TextStyle>;
  weight?: "700" | "600" | "500" | "400" | "300";
}) {
  return (
    <RnText
      style={[
        getStyleFromSize(variant),
        { color: Colors.primaryForeground, fontWeight: weight || '400' },
        style,

      ]}
    >
      {children}
    </RnText>
  );
}

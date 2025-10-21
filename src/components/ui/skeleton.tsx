import React, { ReactNode, useEffect } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  cancelAnimation,
  Easing,
  ReduceMotion,
} from "react-native-reanimated";
import { LinearGradient } from "react-native-linear-gradient";
import Colors from "~/theme/colors";

/**
 * Skeleton Component with shimmer animation
 * 
 * Usage examples:
 * 
 * // Basic skeleton with default settings
 * <Skeleton />
 * 
 * // Custom skeleton
 * <Skeleton 
 *   isLoading={loading}
 *   style={{ height: 50, width: 200 }}
 *   duration={1500}
 *   delay={200}
 * />
 * 
 * // With content (shows content when not loading)
 * <Skeleton isLoading={loading}>
 *   <Text>Content here</Text>
 * </Skeleton>
 */

type SkeletonProps = {
  isLoading?: boolean;
  baseColor?: string; // Background color of the skeleton
  shimmerColor?: string; // Color of the moving shimmer highlight
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  reduceMotion?: "always" | "never" | "system";
};

const GRADIENT_WIDTH_PERCENTAGE = 1; //how wide you want the gradient to be

const Skeleton: React.FC<SkeletonProps> = ({
  isLoading = true,
  children,
  baseColor = Colors.secondaryBackgroundDark,
  shimmerColor = Colors.muted,
  style,
  duration = 1000,
  delay = 0,
  reduceMotion = 'system'
}) => {
  const sharedValue = useSharedValue(0);
  const componentWidth = useSharedValue(0);


  const motion =
  	reduceMotion === "never"
  		? ReduceMotion.Never
  		: reduceMotion === "always"
  			? ReduceMotion.Always
  			: ReduceMotion.System;

  useEffect(() => {
  	if (isLoading) {
  		sharedValue.value = 0; // Reset before starting
  		
  		const startAnimation = () => {
  			sharedValue.value = withRepeat(
  				withTiming(1, {
  					duration: duration,
  					easing: Easing.linear,
  					reduceMotion: motion,
  				}),
  				-1,
  				false
  			);
  		};

  		// Apply delay if specified
  		if (delay > 0) {
  			const timeout = setTimeout(startAnimation, delay);
  			return () => {
  				clearTimeout(timeout);
  				cancelAnimation(sharedValue);
  			};
  		} else {
  			startAnimation();
  		}
  	} else {
  		// Cancel animation if not loading
  		cancelAnimation(sharedValue);
  		sharedValue.value = 0;
  	}

  	// Cleanup
  	return () => cancelAnimation(sharedValue);
  }, [isLoading, sharedValue, duration, delay, motion]);

  const animatedStyle = useAnimatedStyle(() => {
  	const gradientWidth = componentWidth.value * GRADIENT_WIDTH_PERCENTAGE;
  	const translateX = interpolate(
  		sharedValue.value,
  		[0, 1],
  		[-gradientWidth, componentWidth.value]
  	);

  	// Control opacity based on measurement *within the animated style*
  	const opacity = componentWidth.value > 0 ? 1 : 0;

  	return {
  		opacity: opacity,
  		transform: [{ translateX }],
  		width: gradientWidth,
  	};
  });

  //calculate the view layout
  const handleLayout = (event: LayoutChangeEvent) => {
  	const width = event.nativeEvent.layout.width;
  	componentWidth.value = width;
  };

  if (!isLoading) {
  	return children ? <>{children}</> : null;
  }

  return (
  	<View
  		style={[
  			styles.container, 
  			styles.defaultShape,
  			{ backgroundColor: baseColor }, 
  			style
  		]}
  		onLayout={handleLayout} // Measure the width
  	>
  		<Animated.View
  			style={[
  				StyleSheet.absoluteFill,
  				styles.gradientContainer,
  				animatedStyle,
  			]}
  		>
  			<LinearGradient
  				colors={[baseColor, shimmerColor, baseColor]}
  				start={{ x: 0, y: 0.5 }}
  				end={{ x: 1, y: 0.5 }}
  				style={styles.gradient}
  			/>
  		</Animated.View>
  	</View>
  );
};

const styles = StyleSheet.create({
  container: {
  	overflow: "hidden",
  	position: "relative",
  },
  defaultShape: {
  	height: 20,
  	borderRadius: 4,
  	minWidth: 100,
  },
  gradientContainer: {
  	position: "absolute",
  	top: 0,
  	bottom: 0,
  	left: 0,
  },
  gradient: {
  	flex: 1,
  },
});

// Preset skeleton components for common use cases
export const SkeletonText: React.FC<Omit<SkeletonProps, 'style'> & { style?: StyleProp<ViewStyle> }> = (props) => (
  <Skeleton {...props} style={[{ height: 16, borderRadius: 4 }, props.style]} />
);

export const SkeletonTitle: React.FC<Omit<SkeletonProps, 'style'> & { style?: StyleProp<ViewStyle> }> = (props) => (
  <Skeleton {...props} style={[{ height: 24, borderRadius: 6, width: '60%' }, props.style]} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'style'> & { style?: StyleProp<ViewStyle> }> = (props) => (
  <Skeleton {...props} style={[{ height: 40, width: 40, borderRadius: 20 }, props.style]} />
);

export const SkeletonCard: React.FC<Omit<SkeletonProps, 'style'> & { style?: StyleProp<ViewStyle> }> = (props) => (
  <Skeleton {...props} style={[{ height: 100, borderRadius: 8 }, props.style]} />
);

export default Skeleton;

import React, { useState, useMemo } from 'react';
import { View, LayoutChangeEvent, Dimensions } from 'react-native';
import Text from './ui/text';
import Colors from '~/theme/colors';
import { LineChart } from 'react-native-gifted-charts';

export default function GraphData({
  points,
  xAxisData,
  timeframe,
  color,
}: {
  points?: Array<{ value: number }>;
  xAxisData?: string[];
  timeframe?: 'intraday' | 'daily' | 'weekly' | 'monthly';
  color?: string;
} = {}) {
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width - 64,
  );

  const data = useMemo(
    () =>
      points ?? [
        { value: 0 },
        { value: 50 },
        { value: 53 },
        { value: 24 },
        { value: 50 },
        { value: 20 },
        { value: 80 },
        { value: 45 },
        { value: 70 },
        { value: 65 },
        { value: 90 },
        { value: 100 },
      ],
    [points],
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  // Calculate proper spacing based on container width and data points
  const spacing = useMemo(() => {
    const count = data.length;
    if (count <= 1) return 50;

    // Calculate spacing to fill the width
    const totalWidth = containerWidth - 40; // Account for padding
    const calculatedSpacing = totalWidth / (count - 1);

    // Ensure minimum spacing for readability
    return Math.max(calculatedSpacing, 8);
  }, [containerWidth, data.length]);

  // Sample x-axis labels intelligently
  const sampledXAxis = useMemo(() => {
    if (!xAxisData || xAxisData.length === 0) return undefined;

    // Determine how many labels we can fit
    const labelWidth = timeframe === 'daily' ? 50 : 70;
    const maxLabels = Math.floor(containerWidth / labelWidth);

    if (xAxisData.length <= maxLabels) {
      return xAxisData;
    }

    // Sample evenly, always including first and last
    const step = Math.ceil(xAxisData.length / maxLabels);
    return xAxisData.map((label, i) => {
      if (i === 0 || i === xAxisData.length - 1 || i % step === 0) {
        return label;
      }
      return '';
    });
  }, [xAxisData, containerWidth, timeframe]);

  // Find min and max for better scaling
  const { minValue, maxValue } = useMemo(() => {
    const values = data.map(d => d.value);
    return {
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
    };
  }, [data]);

  return (
    <View onLayout={handleLayout} style={{ width: '100%' }}>
      <View style={{ height: 280, paddingTop: 20 }}>
        <LineChart
          data={data}
          width={containerWidth - 40}
          spacing={spacing}
          initialSpacing={10}
          endSpacing={10}
          hideDataPoints={false}
          dataPointsRadius={3}
          dataPointsColor={Colors.primary}
          curved
          thickness={2}
          hideRules={false}
          rulesType="solid"
          rulesColor="rgba(255,255,255,0.1)"
          hideYAxisText={false}
          yAxisTextStyle={{ color: Colors.muted, fontSize: 10 }}
          yAxisColor="transparent"
          yAxisThickness={0}
          noOfSections={5}
          maxValue={maxValue * 1.1}
          // minValue={minValue * 0.9}
          xAxisColor={Colors.muted}
          xAxisThickness={1}
          xAxisLabelsHeight={60}
          color={Colors.primary}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.3}
          endOpacity={0.05}
          areaChart
          xAxisLabelTexts={sampledXAxis}
          xAxisLabelTextStyle={{
            color: Colors.muted,
            fontSize: 12,
            marginTop: 0,
            height: 40,
            width: 40,
          }}
          rotateLabel
          xAxisTextNumberOfLines={3}
          pointerConfig={{
            pointerStripUptoDataPoint: true,
            pointerStripColor: Colors.primary,
            pointerStripWidth: 1,
            strokeDashArray: [3, 3],
            pointerColor: Colors.primary,
            radius: 5,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any[]) => {
              return (
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                  >
                    ${Number(items[0].value).toFixed(2)}
                  </Text>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
}

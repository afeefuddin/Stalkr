import React from 'react';
import { View } from 'react-native';
import Text from '~/components/ui/text';
import Colors from '~/theme/colors';

interface Props {
  overview: any;
}

export const CompanyOverviewCard: React.FC<Props> = ({ overview }) => {
  const metrics = [
    ['Market Cap', overview.MarketCapitalization],
    ['P/E Ratio', overview.PERatio],
    ['EPS', overview.EPS],
    ['Dividend', overview.DividendPerShare],
    ['Yield', overview.DividendYield],
    ['Beta', overview.Beta],
    ['52W Low', overview['52WeekLow']],
    ['52W High', overview['52WeekHigh']],
    ['50 DMA', overview['50DayMovingAverage']],
    ['200 DMA', overview['200DayMovingAverage']],
    ['Target Price', overview.AnalystTargetPrice],
    ['Country', overview.Country],
  ];

  return (
    <View style={{ backgroundColor: Colors.secondary, padding: 20, borderRadius: 16, gap: 16 }}>
      <View>
        <Text weight="700" style={{ fontSize: 18, marginBottom: 6 }}>
          Company Overview
        </Text>
        <Text style={{ color: Colors.muted, fontSize: 14 }}>
          {overview.Sector ?? ''} • {overview.Industry ?? ''}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }}>
        {metrics.map(([label, value], idx) => (
          <View key={idx} style={{ width: '50%', paddingHorizontal: 8, paddingVertical: 8 }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 }}>
              <Text style={{ color: Colors.muted, fontSize: 11, marginBottom: 4 }}>{label}</Text>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{value ?? '—'}</Text>
            </View>
          </View>
        ))}
      </View>

      {overview.Description && (
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, marginTop: 8 }}>
          <Text weight="700" style={{ fontSize: 16, marginBottom: 8 }}>
            About
          </Text>
          <Text style={{ color: Colors.muted, lineHeight: 20, fontSize: 13 }}>{overview.Description}</Text>
        </View>
      )}
    </View>
  );
};

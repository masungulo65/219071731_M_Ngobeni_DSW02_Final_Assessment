import React, { useState } from 'react';

import {
  View,
  Text,
  FlatList
} from 'react-native';

import ReportCard from './components/ReportCard';

export default function App() {

  const [reports, setReports] = useState([
    {
      id: '1',
      category: 'Pothole',
      locationText: 'Soweto',
      description: 'Large pothole on the road',
      resolved: false
    },
    {
      id: '2',
      category: 'Streetlight',
      locationText: 'Johannesburg',
      description: 'Streetlight not working',
      resolved: true
    },
    {
      id: '3',
      category: 'Water leak',
      locationText: 'Roodepoort',
      description: 'Water leaking from a pipe',
      resolved: false
    }
  ]);

  function toggleResolved(id) {

    const updatedReports = reports.map(function(report) {

      if (report.id === id) {

        return {
          ...report,
          resolved: !report.resolved
        };

      }

      return report;

    });

    setReports(updatedReports);

  }

  const openReports = reports.filter(function(report) {
    return !report.resolved;
  }).length;

  return (

    <View style={{ flex: 1, paddingTop: 40 }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        MuniFix SA
      </Text>

      <Text>
        Open Reports: {openReports}
      </Text>

      <FlatList
        data={reports}
        keyExtractor={function(item) {
          return item.id.toString();
        }}
        renderItem={function({ item }) {
          return (
            <ReportCard
              report={item}
              onToggle={toggleResolved}
            />
          );
        }}
      />

    </View>

  );

}
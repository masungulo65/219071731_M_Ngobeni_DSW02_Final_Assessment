import React, { useEffect, useRef } from 'react';

import {
  Animated,
  Text,
  Pressable,
  StyleSheet
} from 'react-native';

function ReportCard({ report, onToggle }) {

  const fade = useRef(new Animated.Value(0)).current;
  const moveUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),

      Animated.timing(moveUp, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      })

    ]).start();

  }, []);

  return (

    <Animated.View
      style={[
        styles.card,
        {
          opacity: fade,
          transform: [{ translateY: moveUp }]
        }
      ]}
    >

      <Text style={styles.category}>
        {report.category}
      </Text>

      <Text>{report.locationText}</Text>

      <Text>{report.description}</Text>

      <Pressable
        onPress={() => onToggle(report.id)}
        style={[
          styles.status,
          report.resolved ? styles.resolved : styles.open
        ]}
      >

        <Text>
          {report.resolved ? 'Resolved' : 'Open'}
        </Text>

      </Pressable>

    </Animated.View>

  );
}

const styles = StyleSheet.create({

  card: {
    padding: 15,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3
  },

  category: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  status: {
    padding: 10,
    marginTop: 10,
    borderRadius: 5
  },

  resolved: {
    backgroundColor: '#b7e4c7'
  },

  open: {
    backgroundColor: '#ffd6a5'
  }

});

export default ReportCard;
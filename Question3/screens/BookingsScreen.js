import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

import { useAppContext } from '../context/AppContext';

export default function BookingsScreen() {

  const {
    user,
    bookings,
    bookingCount,
    bookingError
  } = useAppContext();

  const [serviceType, setServiceType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Create a booking
  async function createBooking() {

    if (!serviceType.trim() || !preferredDate.trim()) {

      setError('Please enter a service type and preferred date.');
      return;

    }

    try {

      setLoading(true);
      setError('');
      setMessage('');

      const bookingsRef = collection(
        db,
        'users',
        user.uid,
        'bookings'
      );

      await addDoc(bookingsRef, {

        serviceType: serviceType.trim(),

        preferredDate: preferredDate.trim(),

        notes: notes.trim(),

        status: 'Active',

        createdAt: serverTimestamp()

      });

      setServiceType('');
      setPreferredDate('');
      setNotes('');

      setMessage('Your booking was successfully created.');

    } catch (err) {

      setError('Unable to create booking. Please try again.');

    } finally {

      setLoading(false);

    }

  }

  // Cancel/delete a booking
  async function cancelBooking(bookingId) {

    try {

      setError('');
      setMessage('');

      await deleteDoc(
        doc(
          db,
          'users',
          user.uid,
          'bookings',
          bookingId
        )
      );

      setMessage('Booking successfully cancelled.');

    } catch (err) {

      setError('Unable to cancel booking. Please try again.');

    }

  }

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        My Clinic Bookings
      </Text>

      <Text>
        Patient: {user.displayName || user.email}
      </Text>

      <Text>
        Total bookings: {bookingCount}
      </Text>

      <Text style={styles.subheading}>
        Create a Booking
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Service type (e.g. General Consultation)"
        value={serviceType}
        onChangeText={setServiceType}
      />

      <TextInput
        style={styles.input}
        placeholder="Preferred date (e.g. 2026-11-10)"
        value={preferredDate}
        onChangeText={setPreferredDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Additional notes"
        value={notes}
        onChangeText={setNotes}
      />

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      {message !== '' && (
        <Text style={styles.success}>{message}</Text>
      )}

      <Button
        title={loading ? 'Saving...' : 'Create Booking'}
        onPress={createBooking}
        disabled={loading}
      />

      <Text style={styles.subheading}>
        My Bookings
      </Text>

      {bookingError !== '' && (
        <Text style={styles.error}>{bookingError}</Text>
      )}

      <FlatList

        data={bookings}

        keyExtractor={item => item.id}

        ListEmptyComponent={
          <Text>No bookings available.</Text>
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.service}>
              {item.serviceType}
            </Text>

            <Text>
              Preferred date: {item.preferredDate}
            </Text>

            <Text>
              Notes: {item.notes || 'None'}
            </Text>

            <Text>
              Status: {item.status}
            </Text>

            <Button
              title="Cancel Booking"
              onPress={() => cancelBooking(item.id)}
            />

          </View>

        )}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 15
  },

  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10
  },

  subheading: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  card: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginTop: 10,
    borderRadius: 8
  },

  service: {
    fontSize: 17,
    fontWeight: 'bold'
  },

  error: {
    color: 'red',
    marginBottom: 10
  },

  success: {
    color: 'green',
    marginBottom: 10
  }

});
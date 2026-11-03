import React from 'react';

import {
  View,
  Text,
  Button,
  StyleSheet
} from 'react-native';

import { signOut } from 'firebase/auth';

import { auth } from '../firebaseConfig';

import { useAppContext } from '../context/AppContext';

export default function ProfileScreen() {

  const {
    user,
    bookingCount
  } = useAppContext();

  async function logoutUser() {

    try {

      await signOut(auth);

    } catch (error) {

      // Do not log private user information
    }

  }

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Patient Profile
      </Text>

      <Text style={styles.info}>
        Name: {user.displayName || 'Not provided'}
      </Text>

      <Text style={styles.info}>
        Email: {user.email}
      </Text>

      <Text style={styles.info}>
        My bookings: {bookingCount}
      </Text>

      <Button
        title="Logout"
        onPress={logoutUser}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },

  info: {
    fontSize: 17,
    marginBottom: 15
  }

});
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

import { auth } from '../firebaseConfig';

export default function AuthScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Convert Firebase errors into readable messages
  function getErrorMessage(errorCode) {

    switch (errorCode) {

      case 'auth/email-already-in-use':
        return 'This email address is already registered.';

      case 'auth/invalid-email':
        return 'Please enter a valid email address.';

      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';

      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password.';

      case 'auth/network-request-failed':
        return 'Network problem. Please check your connection.';

      default:
        return 'Authentication failed. Please try again.';

    }

  }

  // Register a new patient
  async function registerUser() {

    if (!name.trim() || !email.trim() || !password) {

      setError('Please complete all required fields.');
      return;

    }

    try {

      setLoading(true);
      setError('');

      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName: name.trim()
      });

    } catch (err) {

      setError(getErrorMessage(err.code));

    } finally {

      setLoading(false);

    }

  }

  // Login an existing patient
  async function loginUser() {

    if (!email.trim() || !password) {

      setError('Please enter your email and password.');
      return;

    }

    try {

      setLoading(true);
      setError('');

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    } catch (err) {

      setError(getErrorMessage(err.code));

    } finally {

      setLoading(false);

    }

  }

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Gauteng Clinic Booking
      </Text>

      <Text style={styles.subheading}>
        {isRegistering ? 'Create Account' : 'Patient Login'}
      </Text>

      {isRegistering && (

        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
        />

      )}

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      {loading ? (

        <ActivityIndicator size="large" />

      ) : (

        <Button
          title={isRegistering ? 'Register' : 'Login'}
          onPress={isRegistering ? registerUser : loginUser}
        />

      )}

      <View style={styles.switchButton}>

        <Button
          title={
            isRegistering
              ? 'Already have an account? Login'
              : 'Create a new account'
          }
          onPress={() => {

            setIsRegistering(!isRegistering);
            setError('');

          }}
          disabled={loading}
        />

      </View>

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
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },

  subheading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 5
  },

  error: {
    color: 'red',
    marginBottom: 10
  },

  switchButton: {
    marginTop: 15
  }

});
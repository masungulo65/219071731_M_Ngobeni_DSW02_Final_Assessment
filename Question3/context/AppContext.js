import React, {
    createContext,
    useContext,
    useState,
    useEffect
  } from 'react';
  
  import { onAuthStateChanged } from 'firebase/auth';
  
  import {
    collection,
    onSnapshot
  } from 'firebase/firestore';
  
  import { auth, db } from '../firebaseConfig';
  
  const AppContext = createContext();
  
  export function AppProvider({ children }) {
  
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingError, setBookingError] = useState('');
  
    // Check the current authentication session
    useEffect(() => {
  
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  
        setUser(currentUser);
        setLoading(false);
  
      });
  
      return unsubscribe;
  
    }, []);
  
    // Listen for bookings belonging to the signed-in user
    useEffect(() => {
  
      if (!user) {
        setBookings([]);
        setBookingError('');
        return;
      }
  
      const bookingsRef = collection(
        db,
        'users',
        user.uid,
        'bookings'
      );
  
      const unsubscribe = onSnapshot(
        bookingsRef,
  
        (snapshot) => {
  
          const bookingList = snapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
          }));
  
          setBookings(bookingList);
          setBookingError('');
  
        },
  
        (error) => {
  
          setBookingError(
            'Unable to load your bookings. Please try again.'
          );
  
        }
  
      );
  
      return unsubscribe;
  
    }, [user]);
  
    // Derived booking count
    const bookingCount = bookings.length;
  
    return (
  
      <AppContext.Provider
        value={{
          user,
          bookings,
          bookingCount,
          loading,
          bookingError
        }}
      >
  
        {children}
  
      </AppContext.Provider>
  
    );
  
  }
  
  // Custom hook for accessing global state
  export function useAppContext() {
  
    return useContext(AppContext);
  
  }
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import BasketItemCard from '../components/BasketItemCard';

import { API_URL } from '../apiConfig';

const CACHE_KEY = '@mzansi_basket_cache';
const WATCHLIST_KEY = '@mzansi_watchlist';

export default function HomeScreen() {

  // Product data
  const [products, setProducts] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data source: live or cached
  const [dataSource, setDataSource] = useState('');

  // Search and filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Watchlist
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistError, setWatchlistError] = useState('');

  // Restore watchlist when application starts
  useEffect(() => {

    async function loadWatchlist() {

      try {

        const savedWatchlist = await AsyncStorage.getItem(WATCHLIST_KEY);

        if (savedWatchlist !== null) {

          const savedData = JSON.parse(savedWatchlist);

          if (Array.isArray(savedData)) {
            setWatchlist(savedData);
          }

        }

      } catch (err) {

        setWatchlistError('Unable to load saved watchlist.');

      }

    }

    loadWatchlist();

  }, []);

  // Fetch grocery data when screen first loads
  useEffect(() => {

    loadProducts();

  }, []);

  // Fetch products and cache successful results
  async function loadProducts() {

    try {

      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      // Check whether request was successful
      if (!response.ok) {
        throw new Error('Unable to retrieve grocery data.');
      }

      // Convert response into JSON
      const data = await response.json();

      // Check API data
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('The API returned invalid or empty data.');
      }

      // Display live products
      setProducts(data);
      setDataSource('live');

      // Save latest successful response
      try {

        await AsyncStorage.setItem(
          CACHE_KEY,
          JSON.stringify(data)
        );

      } catch (storageError) {

        console.log('Unable to save cache:', storageError);

      }

    } catch (err) {

      // If API fails, try loading cached data
      try {

        const cachedData = await AsyncStorage.getItem(CACHE_KEY);

        if (cachedData !== null) {

          const savedProducts = JSON.parse(cachedData);

          if (!Array.isArray(savedProducts) || savedProducts.length === 0) {
            throw new Error('Invalid cached data.');
          }

          setProducts(savedProducts);
          setDataSource('cached');

        } else {

          setError(
            'No internet connection and no saved grocery data available.'
          );

        }

      } catch (storageError) {

        setError(
          'Unable to retrieve grocery data from the API or local storage.'
        );

      }

    } finally {

      setLoading(false);

    }

  }

  // Add product to watchlist
  async function addToWatchlist(item) {

    try {

      setWatchlistError('');

      // Prevent duplicates
      const alreadyExists = watchlist.some(
        product => product.id === item.id
      );

      if (alreadyExists) {
        return;
      }

      const updatedWatchlist = [...watchlist, item];

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        WATCHLIST_KEY,
        JSON.stringify(updatedWatchlist)
      );

      setWatchlist(updatedWatchlist);

    } catch (err) {

      setWatchlistError('Unable to save product to watchlist.');

    }

  }

  // Remove product from watchlist
  async function removeFromWatchlist(id) {

    try {

      setWatchlistError('');

      const updatedWatchlist = watchlist.filter(
        item => item.id !== id
      );

      await AsyncStorage.setItem(
        WATCHLIST_KEY,
        JSON.stringify(updatedWatchlist)
      );

      setWatchlist(updatedWatchlist);

    } catch (err) {

      setWatchlistError('Unable to update watchlist.');

    }

  }

  // Search and filter products
  const filteredProducts = products.filter(item => {

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category.trim() === '' ||
      item.category.toLowerCase().includes(category.toLowerCase());

    const matchesPrice =
      maxPrice.trim() === '' ||
      Number(item.price) <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesPrice;

  });

  // Calculate number of visible products
  const resultCount = filteredProducts.length;

  // Calculate average price of visible products
  const totalPrice = filteredProducts.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const averagePrice =
    resultCount > 0 ? totalPrice / resultCount : 0;

  // Display loading screen
  if (loading) {

    return (
      <View style={styles.center}>

        <ActivityIndicator size="large" />

        <Text>Loading grocery data...</Text>

      </View>
    );

  }

  // Display error if API and cache are unavailable
  if (error) {

    return (
      <View style={styles.center}>

        <Text style={styles.error}>{error}</Text>

        <Button
          title="Try Again"
          onPress={loadProducts}
        />

      </View>
    );

  }

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Mzansi Basket Watch
      </Text>

      {/* Data source status */}
      {dataSource === 'live' ? (

        <Text style={styles.live}>
          Live grocery data
        </Text>

      ) : (

        <Text style={styles.cached}>
          Offline Mode - Showing cached data
        </Text>

      )}

      {/* Search */}
      <TextInput
        style={styles.input}
        placeholder="Search grocery items..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Category filter */}
      <TextInput
        style={styles.input}
        placeholder="Filter by category (e.g. Dairy)"
        value={category}
        onChangeText={setCategory}
      />

      {/* Maximum price filter */}
      <TextInput
        style={styles.input}
        placeholder="Maximum price"
        value={maxPrice}
        onChangeText={setMaxPrice}
        keyboardType="numeric"
      />

      {/* Results information */}
      <Text style={styles.info}>
        Number of results: {resultCount}
      </Text>

      <Text style={styles.info}>
        Average price: R{averagePrice.toFixed(2)}
      </Text>

      {/* Watchlist information */}
      <Text style={styles.subheading}>
        My Watchlist ({watchlist.length})
      </Text>

      {watchlistError !== '' && (
        <Text style={styles.error}>{watchlistError}</Text>
      )}

      {watchlist.length === 0 ? (

        <Text>No products in your watchlist.</Text>

      ) : (

        watchlist.map(item => (

          <View key={item.id} style={styles.watchlistItem}>

            <Text>
              {item.name} - R{Number(item.price).toFixed(2)}
            </Text>

            <Button
              title="Remove"
              onPress={() => removeFromWatchlist(item.id)}
            />

          </View>

        ))

      )}

      {/* Product list */}
      <FlatList

        data={filteredProducts}

        keyExtractor={item => item.id}

        renderItem={({ item }) => (

          <BasketItemCard
            item={item}

            isInWatchlist={watchlist.some(
              product => product.id === item.id
            )}

            onAdd={addToWatchlist}

            onRemove={removeFromWatchlist}
          />

        )}

        ListEmptyComponent={

          <Text style={styles.empty}>
            No grocery items match your search or filters.
          </Text>

        }

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2f2f2'
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },

  subheading: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
    borderRadius: 5
  },

  info: {
    fontSize: 15,
    marginTop: 5
  },

  live: {
    color: 'green',
    marginBottom: 10
  },

  cached: {
    color: 'orange',
    marginBottom: 10
  },

  error: {
    color: 'red',
    marginBottom: 10
  },

  watchlistItem: {
    backgroundColor: 'white',
    padding: 8,
    marginBottom: 5,
    borderRadius: 5
  },

  empty: {
    textAlign: 'center',
    marginTop: 20
  }

});
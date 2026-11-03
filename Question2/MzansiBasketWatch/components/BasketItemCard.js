import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function BasketItemCard({
  item,
  isInWatchlist,
  onAdd,
  onRemove
}) {
  return (
    <View style={styles.card}>

      <Text style={styles.name}>{item.name}</Text>

      <Text>Category: {item.category}</Text>

      <Text>Store: {item.store}</Text>

      <Text>Province: {item.province}</Text>

      <Text>Area: {item.area}</Text>

      <Text style={styles.price}>
        Price: R{Number(item.price).toFixed(2)}
      </Text>

      {isInWatchlist ? (
        <Button
          title="Remove from Watchlist"
          onPress={() => onRemove(item.id)}
        />
      ) : (
        <Button
          title="Add to Watchlist"
          onPress={() => onAdd(item)}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10
  }
});
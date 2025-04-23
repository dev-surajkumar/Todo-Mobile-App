import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TaskOnLoad from './TaskOnLoad';
import { ThemeContext } from './ThemeContext';

const Home = () => {
  const navigation = useNavigation();
  const { darkMode } = useContext(ThemeContext); // useContext moved inside the component

  return (
    <View style={[styles.homeContainer, darkMode && { backgroundColor: '#121212' }]}>
      <TaskOnLoad />
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Add')}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // default light background
  },
  homeButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#e6f0ff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  plusText: {
    fontSize: 40,
    color: '#2065ae',
    textAlign: 'center',
  },
});

export default Home;

import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Feather icons library
import { ThemeContext } from './ThemeContext';

const Header = React.memo(() => {
  const navigation = useNavigation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.headerContainer, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <View style={styles.iconContainer}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={40} color={darkMode ? 'aqua' : '#333'} />
        </TouchableOpacity> */}
        
        {/* Home Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={40} color={darkMode ? 'aqua' : '#333'} style={styles.iconSpacing} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleTheme}>
        <Icon
          name={darkMode ? 'sun' : 'moon'}
          size={24}
          color={darkMode ? 'yellow' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    height: 50,
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 15, // Add space between the icons
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Header;

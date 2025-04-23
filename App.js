import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import Home from './components/Home';
import Addtask from './components/Addtask';
import Header from './components/Header';
import { ThemeProvider } from './components/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              header: () => <Header />
            }}
            initialRouteName="Home"
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Add" component={Addtask} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Match your theme or base background
  },
});

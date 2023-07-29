import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Authorization from './src/components/Authorization';
import Registration from './src/components/Registration';
import Chats from './src/components/Chats';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './src/components/LoadingScreen';
import Messenger from './src/components/Messenger';
import { styles } from './src/styles/MyComponentStyles';

const Stack = createStackNavigator();

const App = () => {
  const [isAccessTokenValid, setIsAccessTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem('access');
      if (accessToken) {
        setIsAccessTokenValid(true);
      }
      setIsCheckingToken(false);
    };
    
    checkAccessToken();
  }, [isCheckingToken]);

  if (isCheckingToken) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAccessTokenValid ? "Chats" : "Login"}
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: 'white',
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            title: 'Registration',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Authorization}
          options={{
            title: 'Login',
          }}
        />
        <Stack.Screen
          name="Chats"
          component={Chats}
          options={{
            title: 'Chats',
          }}
        />
        <Stack.Screen
          name="Messenger"
          component={Messenger}
          options={{
            title: 'Messenger',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

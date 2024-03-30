import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import { useCallback, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Main, PreloadScreen, LoginScreen, ProfileScreen, SignupScreen, CommunityHome, Members, Passcode, TripHomeScreen, YourVehicles, AddNewVehicle, NonMemberScreen, SearchCommunity } from "./components";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase'
import * as SplashScreen from 'expo-splash-screen';


const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      const delay = setTimeout(() => {
        setUser(user)
      }, 1000)
    })

    return () => { 
      unsubscribe()
    }
  }, [])

  // load fonts
  // https://docs.expo.dev/versions/latest/sdk/font/#usage
  const [fontsLoaded, fontError] = useFonts({
    'Poppins': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  StatusBar.setBarStyle('dark-content');
  
  // load tab navigator & screens
  return (
    <NavigationContainer onReady={onLayoutRootView} > 
      {user ? 
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Main" component={ Main } />
          <Stack.Screen options={{ headerShown: false }} name="CommunityHome" component={ CommunityHome }/>
          <Stack.Screen options={{ headerShown: false }} name="Members" component={ Members } />
          <Stack.Screen options={{ headerShown: false }} name="Passcode" component={ Passcode }/>
          <Stack.Screen options={{ headerShown: false }} name="Profile" component={ ProfileScreen } />
          <Stack.Screen options={{ headerShown: false }} name="TripHome" component={ TripHomeScreen }/>
          <Stack.Screen options={{ headerShown: false }} name="YourVehicles" component={ YourVehicles }/>
          <Stack.Screen options={{ headerShown: false }} name="AddNewVehicle" component={ AddNewVehicle }/>
          <Stack.Screen options={{ headerShown: false }} name="NonMemberCommunity" component={ NonMemberScreen }/>
          <Stack.Screen options={{ headerShown: false }} name="SearchCommunities" component={ SearchCommunity }/>
        </Stack.Navigator>
        :
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Preload" component={ PreloadScreen } />
          <Stack.Screen options={{ headerShown: false }} name="Signup" component={ SignupScreen } />
          <Stack.Screen options={{ headerShown: false }} name="Login" component={ LoginScreen } />
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}
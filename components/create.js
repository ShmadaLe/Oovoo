import { StyleSheet, Text, View, Image } from 'react-native';
import { Themes, Images } from "../assets/themes";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChooseCreate, CreateCommunity, CreateTrip, CreateTripSearch } from "./createscreens";

const Stack = createNativeStackNavigator();

export default function CreateScreen() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
      
    >
      <Stack.Screen name="Trip or Community" component={ChooseCreate} 
        options={{
          gestureDirection: 'vertical'
        }}
      />
      <Stack.Screen name="Create Trip Search" component={CreateTripSearch} />
      <Stack.Screen name="Create Trip" component={CreateTrip} />
      <Stack.Screen name="Create Community" component={CreateCommunity} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
  },
});

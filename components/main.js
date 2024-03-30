import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from "./home.js";
import CreateScreen from "./create.js";
import ProfileScreen from "./profile.js";
import { Themes, Images } from "../assets/themes";
import { auth } from '../firebase'

const Tab = createBottomTabNavigator();

// https://youtu.be/gPaBicMaib4?si=E152NKtpXSX6GteA
const CreateTabButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={ styles.createTabButtonTouchable }
    onPress={ onPress }
    activeOpacity={ 1.0 }
  >
    <View style={ styles.createTabButtonView }>
      { children }
    </View>
  </TouchableOpacity>
);

export default function Main() {
  user = auth.currentUser;

  // load tab navigator & screens
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarStyle: styles.tabBarStyle,
          tabBarIcon: ({ focused }) => {
            if (route.name === "Home") {
              let iconName = focused ? "home-sharp" : "home-outline";
              return <Ionicons name={ iconName } size={ 34 } color={ Themes.colors.grayButton } />
            } else if (route.name === "Me") {
              let imageOpacity = focused ? 1 : 0.5;
              let border = focused ? 0.7 : 0;
              return <Image source={ {uri: user.photoURL} } style={ [styles.profileIcon, { opacity: imageOpacity, borderWidth: border }] }/>
            } else {  // route.name === "Create"
              return <Image source={ Images.car } style={ styles.createIcon }/>
            }
          }
        })}
        backBehavior='history'
      >
        <Tab.Screen name="Home" component={ HomeScreen } />
        <Tab.Screen name="Create" component={ CreateScreen } 
          options={{
            tabBarButton: ( props ) => (
              <CreateTabButton {...props} />
            ),
            tabBarStyle: { display: 'none'},
          }}
        />
        <Tab.Screen name="Me" component={ ProfileScreen } />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  profileIcon: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    overflow: 'hidden',
    borderColor: Themes.colors.grayButton,
  },
  createIcon: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    overflow: 'hidden',
    borderColor: Themes.colors.orange,
    borderWidth: 2,
    padding: 10,
  },
  tabBarStyle: {
    height: 95, 
    paddingTop: 16,  
    borderTopWidth: 1.25, 
    borderColor: 'rgba(61, 61, 61, 0.67)',
  },
  tabBarLabelStyle: { 
    fontSize: 11, 
    fontFamily: 'Poppins', 
    color: Themes.colors.grayButton,
    backgroundColor: 'transparent',
  },
  createTabButtonTouchable: {
    top: -35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createTabButtonView: {
    width: 92,
    height: 92,
    borderRadius: 92 / 2,
  },
});

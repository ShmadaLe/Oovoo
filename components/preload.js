import { StyleSheet, Text, TouchableOpacity, Image, SafeAreaView, LogBox } from 'react-native'
import { Images, Themes } from "../assets/themes";

LogBox.ignoreLogs([
  'Auth',
]);

export default function PreloadScreen( {navigation} ) {

  return (
    <SafeAreaView style={ styles.container }>
      <Image source={ Images.logo_transparent } style={ styles.logo }/>
        <TouchableOpacity style={ styles.signUpButton } onPress={() => navigation.navigate('Signup')} >
          <Text style={styles.whiteText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ styles.loginButton } onPress={() => navigation.navigate('Login')}>
          <Text style={styles.orangeText}>Login</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Themes.colors.white,
  },
  signUpButton: {
    width: 300,
    height: 50,
    borderRadius: 30, // Half of the height to make it oval
    backgroundColor: Themes.colors.orange, // You can set the background color as per your design
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },
  loginButton: {
    width: 300,
    height: 50,
    borderRadius: 30, // Half of the height to make it oval
    borderColor: Themes.colors.orange, // You can set the background color as per your design
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
  },
  whiteText: {
    fontSize: 18,
    color: Themes.colors.white,
    fontFamily: 'Poppins',
  },
  orangeText: {
    fontSize: 18,
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
  },
  logo: {
    width: 400,
    height: 'auto',
    resizeMode: "contain",
    aspectRatio: 1,
    marginBottom: 15
  },
})
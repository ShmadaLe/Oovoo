import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Themes } from "../assets/themes/index.js";
import BackArrowNavBar from "./backarrownavbar.js";
import OrangeButton from './orangeButton.js';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    auth
      signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }

  return (
    <SafeAreaView style = {styles.container} >
      <BackArrowNavBar navigation={ navigation }></BackArrowNavBar>
      <View style={ styles.header }>
        <Text style={ styles.title }>
          Login to Existing Account
        </Text>
      </View>

      <View style={styles.entryContainer}>
        <Text style={ styles.orangeText }>Login Email:</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <Text style={ styles.orangeText }>Login Password:</Text>
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <OrangeButton onPressFunction={ handleLogin } navigation={ navigation } text="Login"></OrangeButton>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
  },
  entryContainer: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 175
  },
  input: {
    backgroundColor: Themes.colors.textInput,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Poppins',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    width: '100%',
  },
  orangeText: {
    fontSize: 18,
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
    paddingBottom: 3,
    paddingTop: 20,
  },
  header: {
    borderBottomWidth: 1,
    width: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 23,
    textAlign: 'center',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    paddingBottom: 20,
  },
})
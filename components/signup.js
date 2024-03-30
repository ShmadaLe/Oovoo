import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native'
import { Themes, Images } from "../assets/themes/index.js";
import { auth, writeCommunityUserToFirestore, writeUserDataToFirestore } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import BackArrowNavBar from "./backarrownavbar.js";
import OrangeButton from './orangeButton.js';
import * as ImagePicker from "expo-image-picker"; 
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';

const SignupScreen = ( {navigation} ) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [handle, setHandle] = useState('')
  const [name, setUsername] = useState('')
  const [photoURL, setPhotoURL] = useState(Image.resolveAssetSource(Images.add_image).uri);

  // Function to pick an image from the device's media library 
  const pickImage = async () => { 
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

    if (status !== "granted") { 
        // If permission is denied, show an alert 
        Alert.alert( 
            "Permission Denied", 
            `Sorry, we need camera roll permission to upload images.` 
        ); 
    } else { 
        // Launch the image library and get the selected image 
        const result = await ImagePicker.launchImageLibraryAsync(); 

        if (!result.canceled) { 
            // If an image is selected (not cancelled), update the file state variable 
            setPhotoURL(result.assets[0].uri);
        } 
    } 
  }; 

  const uploadImage = async () => {
    const response = await fetch(photoURL);
    const blob = await response.blob();
    const filename = photoURL.substring(photoURL.lastIndexOf('/')+1);
    var ref = firebase.storage().ref().child(filename).put(blob);
    try {
        await ref;
    } catch (e) {
        console.log(e);
    }
    console.log('Photo uploaded!');
    return filename;
  };

  const handleSignUp = async () => {
    if (!email || !password || !handle || !name) {
      Alert.alert('Error', 'Email, password, name, and handle are required.');
      return;
    }
    
    try {
      let filename = await uploadImage();
      let imageURL;
      await firebase.storage().ref("/"+filename).getDownloadURL()
        .then((url) => {
          //from url you can fetched the uploaded image easily
          imageURL = url;
        })

      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredentials.user;
      console.log('Registered with:', user.email);

      await updateProfile(auth.currentUser, {
        displayName: handle,
        photoURL: imageURL
      });

      await writeUserDataToFirestore("users", {username: name});
      await writeCommunityUserToFirestore("Stanford")

      console.log("All signup writes completed successfully")
    } catch (error) {
      console.error("Error during signup:", error)
      alert(error.message)
    }
  };

  return (
    <SafeAreaView style = {styles.container} >
      <BackArrowNavBar navigation={ navigation }></BackArrowNavBar>
      <View style={ styles.header }>
        <Text style={ styles.title }>
          Create Account
        </Text>
      </View>

      <View style={styles.uploadContainer}> 
        {/* Conditionally render the image  
        or error message */} 
        {photoURL ? ( 
            // Display the selected image 
            <TouchableOpacity style={styles.imageContainer} onPress={ pickImage }> 
                <Image source={{ uri: photoURL }}  style={styles.image} /> 
            </TouchableOpacity> 
        ) : ( 
            <Text style={styles.errorText}>Error!</Text> 
        )} 
      </View> 
      
      <View style={ styles.entryContainer }>
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
        <Text style={ styles.orangeText }>Display Name:</Text>
        <TextInput
          value={name}
          onChangeText={text => setUsername(text)}
          style={styles.input}
        />
        <Text style={ styles.orangeText }>Oovoo Handle:</Text>
        <View style={ styles.handleContainer }>
          <Text style={ styles.atsign }>
            @
          </Text>
          {/* TODO: check if handle is availble  */}
          <TextInput
            value={handle}
            onChangeText={text => setHandle(text)}
            style={styles.textInputHandle}
          />
        </View>
      </View>

      <OrangeButton onPressFunction={ handleSignUp } navigation={ navigation } text="Sign Up"></OrangeButton>
    </SafeAreaView>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
  },
  entryContainer: {
    marginLeft: 30,
    marginRight: 30,
  },
  handleContainer: {
    flexDirection: 'row',
    position: 'relative',
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
  header: {
    borderBottomWidth: 1,
    width: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    paddingBottom: 20,
  },
  orangeText: {
    fontSize: 18,
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
    paddingBottom: 3,
    paddingTop: 20,
  },
  atsign: {
    fontSize: 18,
    fontFamily: 'Poppins',
    paddingRight: 8,
  },
  textInputHandle: {
    backgroundColor: Themes.colors.textInput,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Poppins',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    flex: 1,
  },
  uploadContainer: { 
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: 25
  }, 
  imageContainer: { 
    width: 145,
    height: 145,
    borderRadius: 145/2,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: Themes.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  image: { 
    width: '125%',
    height: '125%',
  }, 
  errorText: { 
    color: "red", 
    marginTop: 16, 
  }, 
})

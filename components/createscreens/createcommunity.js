import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { Themes, Images } from "../../assets/themes";
import BackArrowNavBar from "../backarrownavbar.js";
import OrangeButton from '../orangeButton.js';
import * as ImagePicker from "expo-image-picker"; 
import { writeCommunityCreateDataToFirestore } from '../../firebase'
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';

export default function CreateCommunity({ navigation }) {
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [pin, setPin] = useState('')
  const [desc, setDesc] = useState('')
  const [photoURL, setPhotoURL] = useState(Image.resolveAssetSource(Images.add_image).uri);

  const create = async ( navigation ) => {
    // check required fields are filled out
    if (!name || !handle || !pin) {
      Alert.alert('Error', 'Name, handle, and pin are required.');
      return;
    }
    if (pin.length != 4) {
      Alert.alert('Error', 'Pin must be 4 digits.');
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
        
      // upload all of the data to firebase
      currentUser = getAuth().currentUser;
      data = {
        "community_name":name, 
        "community_handle":handle, 
        "passcode":pin, 
        "community_desc":desc, 
        "community_picture":imageURL,
        "num_members": 1,
        "members": [currentUser.displayName]
      };
      await writeCommunityCreateDataToFirestore(data);

      navigation.popToTop(); 
      navigation.navigate('Home'); 
      navigation.navigate('CommunityHome', { community: data });
    } catch (error) {
      console.error('Error creating trip:', error)
    }
  };

  const pickImage = async () => { 
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

    if (status !== "granted") { 
        Alert.alert( 
            "Permission Denied", 
            `Sorry, we need camera roll permission to upload images.` 
        ); 
    } else { 
        const result = await ImagePicker.launchImageLibraryAsync(); 

        if (!result.canceled) { 
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

  return (
    <SafeAreaView style={ styles.container }>
      <BackArrowNavBar navigation={ navigation }></BackArrowNavBar>
      <KeyboardAvoidingView behavior="padding" style={ styles.container }>
        <View style={ styles.header }>
          <Text style={ styles.title }>
            Create Community
          </Text>
        </View>
        <View style={ styles.inputSection }>
          <TouchableOpacity style={ styles.addImageContainer } onPress={pickImage}> 
              {photoURL ? ( 
                <Image source={{ uri: photoURL }} style={ styles.addImage } /> 
              ) : ( 
                <Image source={{ uri: Image.resolveAssetSource(Images.add_image).uri }} style={ styles.image } />
              )} 
          </TouchableOpacity> 
          <Text style={ styles.subtitle }>
            Community Name:
          </Text>
          <TextInput
            value={ name }
            onChangeText={ text => setName(text) }
            style={ styles.textInput }
          />
          <Text style={ styles.subtitle }>
            Community Handle:
          </Text>
          <View style={ styles.handleContainer }>
            <Text style={ styles.atsign }>
              @
            </Text>
            <TextInput
              value={ handle }
              onChangeText={ text => setHandle(text) }
              style={ styles.textInputHandle }
            />
            {/* TODO: check backend for whether the inputted handle has already been used or not */}
            {handle ? ( 
              <Image source={Images.check} style={ styles.check } /> 
            ) : ( 
              null
            )} 
          </View>
          <Text style={ styles.subtitle }>
            4-Digit Pin:
          </Text>
          <TextInput
            value={ pin }
            onChangeText={ text => setPin(text) }
            style={ styles.textInput }
            keyboardType='numeric'
            maxLength={4}
          />
          <Text style={ styles.subtitle }>
            Description:
          </Text>
          <TextInput
            value={ desc }
            onChangeText={ text => setDesc(text) }
            style={ styles.textInput }
          />
        </View>
        <OrangeButton onPressFunction={ create } navigation={ navigation } text="Create"></OrangeButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
  },
  handleContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    paddingBottom: 20,
  },
  subtitle: {
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
  inputSection: {
    marginLeft: 30,
    marginRight: 30,
  },
  textInput: {
    backgroundColor: Themes.colors.textInput,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Poppins',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    width: '100%',
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
  addImageContainer: { 
    width: 145, 
    height: 145, 
    borderRadius: 145/2, 
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
  }, 
  addImage: { 
    width: 145, 
    height: 145, 
    borderRadius: 145/2, 
  }, 
  check: { 
    width: 20, 
    height: 15, 
    position: 'absolute',
    right: 8,
    alignSelf: 'center',
  }, 
});

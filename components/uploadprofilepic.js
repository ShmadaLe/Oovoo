import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker"; 
import { Themes, Images } from "../assets/themes/index.js";

export default function UploadProfile() {
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

  return (
    <View style={styles.container}> 
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
  );
};

const styles = StyleSheet.create({ 
  container: { 
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
});
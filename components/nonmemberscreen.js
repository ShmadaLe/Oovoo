import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView, TextInput } from 'react-native';
import { Themes } from "../assets/themes";
import { auth, writeCommunityUserToFirestore } from '../firebase'
import BackArrowNavBar from "./backarrownavbar.js";
import OrangeButton from './orangeButton.js';

export default function NonMemberScreen({ navigation, route }) {
    const { community } = route.params;

    const [pin, setPin] = useState('')
    
    currentUser = auth.currentUser;

    const addToGroup = (navigation, pinCode) => {
        if (community["passcode"] == pinCode) {
            writeCommunityUserToFirestore(community["community_handle"]);
            
            navigation.popToTop(); 
            navigation.navigate('Home'); 
            navigation.navigate("CommunityHome", {navigation, community: community});
        } else {
            alert("Incorrect Passcode!")
        }
    }

    return (
        <SafeAreaView style={ styles.container }>
            <BackArrowNavBar navigation={ navigation } />
            <View style={ styles.communityContainer }>
                <View style={ styles.circle }>
                    <Image style={ styles.image } source={{ uri: community["community_picture"] }} />
                </View>
                <Text style={ styles.blackTitle }>{ community["community_name"] }</Text>
                <Text style={ styles.darkGraySubtext }>{ community["community_handle"] }</Text>
            </View>
            <View style={ styles.pin }>
                <Text style={ styles.orangeTitle }>Pin Code</Text>
            </View>
            <TextInput
                value={ pin }
                onChangeText={ text => setPin(text) }
                style={ styles.textInput }
                keyboardType='numeric'
                maxLength={4}
            />
            <View style={styles.joinButton}>
                <OrangeButton onPressFunction={ addToGroup } navigation={ navigation } additionalParameter={ pin } text="Join Community"></OrangeButton>
            </View>
            
        </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Themes.colors.white,
        alignItems: 'center',
    },
    communityContainer: {
        backgroundColor: Themes.colors.white,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Themes.colors.black,
        paddingVertical: 20,
        width: Dimensions.get('window').width - 35,
    },
    circle: {
        width: 125,
        height: 125,
        borderRadius: 125,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: Themes.colors.lightGray,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    blackTitle: {
        fontSize: 20,
        color: Themes.colors.black,
        fontFamily: 'Poppins',
    },
    darkGraySubtext: {
        fontSize: 14,
        color: Themes.colors.darkGray,
        fontFamily: 'Poppins',
    },
    pin: {
        marginTop: 10,
    },
    textInput: {
        backgroundColor: Themes.colors.textInput,
        borderRadius: 5,
        fontSize: 16,
        fontFamily: 'Poppins',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        width: '13%',
      },
    orangeTitle: {
        fontSize: 20,
        color: Themes.colors.orange,
        fontFamily: 'Poppins',
    },
    joinButton: {
        marginTop: 220,
    },
});

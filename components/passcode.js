import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView } from 'react-native';
import { Themes } from "../assets/themes";
import { writeRemoveUserFromCommunity } from '../firebase'
import BackArrowNavBar from "./backarrownavbar.js";
import OrangeButton from './orangeButton.js';

export default function Passcode({ navigation, route }) {
    const { community } = route.params;

    const removeFromGroup = (navigation) => {
        writeRemoveUserFromCommunity(community["community_handle"]);
        console.log('Removed from Community!');
        navigation.navigate('Home');
    }

    return (
        <SafeAreaView style={styles.container}>
            <BackArrowNavBar navigation={navigation} />
            <View style={styles.communityContainer}>
                <View style={styles.circle}>
                    <Image style={styles.image} source={{ uri: community["community_picture"] }} />
                </View>
                <Text style={styles.blackTitle}>{community["community_name"]}</Text>
                <Text style={styles.darkGraySubtext}>{community["community_handle"]}</Text>
            </View>
            <View style={styles.passcodeContainer}>
                <Text style={styles.passcode}>{community["passcode"]}</Text>
            </View>
            <OrangeButton
                onPressFunction={removeFromGroup}
                navigation={navigation}
                text="Leave Community"
            >
            </OrangeButton>
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
    passcodeContainer: {
        alignContent: 'center'
    },
    passcode: {
        fontSize: 45,
        color: Themes.colors.black,
        fontFamily: 'Poppins',
        letterSpacing: 40,
        paddingLeft: 40,
        marginTop: 60
    },
    orangeTitle: {
        fontSize: 20,
        color: Themes.colors.orange,
        fontFamily: 'Poppins',
    },
});
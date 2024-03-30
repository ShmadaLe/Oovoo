import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, LogBox } from 'react-native';
import { Themes } from "../assets/themes";
import { auth, getDocFromFirestore, getAllTripsForCommunityFromFirestore } from '../firebase'
import BackArrowNavBar from "./backarrownavbar.js";
import TripList from './triplist.js';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function CommunityHomeScreen({ navigation, route }) {
    const { community } = route.params;
    const [communityData, setCommunityData] = useState(null);
    const [tripsData, setTripsData] = useState(null)
    currentUser = auth.currentUser;
    useEffect(() => {
        async function updateData() {
          let data = await getDocFromFirestore("communities", community.community_handle);
          setCommunityData(data);

          data = await getAllTripsForCommunityFromFirestore(community.community_handle) 
          setTripsData(data)
        }
        updateData();
      
    }, []);

    return communityData && tripsData ? (
        <SafeAreaView style={ styles.container }>
            <View style={ styles.navContainer }>
                <View>
                    <BackArrowNavBar navigation={ navigation } />
                </View>
                <View style={ styles.right }>
                    <TouchableOpacity onPress={ () => navigation.push('Passcode', { navigation, community: community }) }>
                        <Text style={ styles.moreText }>More</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={ styles.communityContainer }>
                <View style={ styles.circle }>
                    <Image style={ styles.image }source={{ uri: community["community_picture"] }} />
                </View>
                <Text style={ styles.blackTitle }>{ community["community_name"] }</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={ styles.darkGraySubtext }> @{ community["community_handle"] } · </Text>
                    <TouchableOpacity onPress={ () => navigation.navigate('Members', {community: community}) }>
                        <Text style={ styles.darkGraySubtext }>{ community["members"].length } members</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.orangeTitle}>Upcoming Trips</Text>
            <TripList trips={ trips }/>
        </SafeAreaView>
    ) : <SafeAreaView></SafeAreaView>;
  }

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row'
    },
    right: {
        flex: 0.99,
        alignItems: 'flex-end',
        marginRight: 20,
        justifyContent: 'center'
    },
    moreText: {
        fontSize: 14,
        color: Themes.colors.darkGray,
        fontFamily: 'Poppins',
    },
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
    blackTitle: {
        fontSize: 20,
        color: Themes.colors.black,
        fontFamily: 'Poppins',
    },
    orangeTitle: {
        fontSize: 20,
        color: Themes.colors.orange,
        fontFamily: 'Poppins-Bold',
        alignSelf: 'flex-start',
        marginVertical: 8,
        paddingLeft: 16,
    },
    darkGraySubtext: {
        fontSize: 14,
        color: Themes.colors.darkGray,
        fontFamily: 'Poppins',
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
    }
});

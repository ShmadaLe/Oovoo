import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Alert, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Themes } from "../assets/themes";
import Trip from "./trip.js"
import { auth, getDocFromFirestore, getCommunitiesFromFirestore, getTripsFromFirestore } from '../firebase'
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({username: "Loading..."});
  const [numGroups, setNumGroups] = useState(0);
  const [trips, setTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  user = auth.currentUser;

  const onRefresh = async() => {
    console.log('Refreshing profile page...')
    setRefreshing(true)
    try {
      const userData = await getDocFromFirestore("users", user.uid);
      setUserData(userData);

      const communities = await getCommunitiesFromFirestore();
      setNumGroups(communities.length);

      const trips = await getTripsFromFirestore("trips");
      setTrips(trips);
    } catch (error) {
      console.error('Error fetching data on profile page:', error)
    } finally {
      setRefreshing(false)
    }
  }
  // hook to await user data from firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        await onRefresh()
      } catch (error) {
        console.error('Error fetching data on profile page:', error)
      }
    }
    fetchData()
  }, []);

  const createTwoButtonAlert = () =>
    Alert.alert('Log Out?', 'You will be returned to the login screen.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Log Out', onPress: () => auth.signOut()},
    ]);

  const renderTrip = ({item}) => {
    let tripDocumentId = item.community_handle + '_' + item.source + '_' + item.destination + '_' + item.date.toDate()

    return (
      <TouchableOpacity onPress={ () => navigation.navigate('TripHome', {documentId: tripDocumentId}) }>
        <Trip
          navigation={navigation}
          imageURL={item.community_picture}
          tripOrganizer={item.community_name}
          tripOrganizerHandle={item.community_handle}
          tripSource={item.source}
          tripDestination={item.destination}
          tripDate={item.date.toDate()}
          tripMembers={item.trip_members}
        />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <TouchableOpacity onPress={ createTwoButtonAlert } style={ styles.signoutContainer }>
        <Text style={ styles.signoutText }>Log Out</Text>
      </TouchableOpacity>
      <View style={ styles.userInfo }>
        <Text style={ styles.name }>{userData.username}</Text>
        <Text style={ styles.username }>@{user.displayName} </Text>
        <Image source={{ uri: user.photoURL }} style={ styles.profileIcon }/>
        <Text style={ styles.numGroups }>{numGroups} Groups</Text>
      </View>
      <View style={ styles.tripsContainer }>
        <Text style={ styles.tripsSubtitle }>My Trips</Text>
        <View style={ styles.tripsList }>
        <FlatList
          data = {trips}
          renderItem = {(item) => renderTrip(item)}
          keyExtractor = {(_, i) => i}
          style = {styles.tripContainer}
          onRefresh = {onRefresh}
          refreshing = {refreshing}
        />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
  },
  tripContainer: {
    backgroundColor: Themes.colors.background,
    flex: 1,
    width: Dimensions.get('window').width - 35,
    marginBottom: 50
  },
  userInfo: {
    padding: 25,
    paddingTop: 10,
  },
  name: {
    fontSize: 22,
    color: Themes.colors.black,
    fontFamily: 'Poppins',
  },
  username: {
    fontSize: 16,
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    paddingBottom: 15,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: Themes.colors.lightGray,
  },
  numGroups: {
    fontSize: 12,
    alignSelf: 'center',
    paddingTop: 10,
    color: Themes.colors.darkGray
  },
  tripsContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  tripsSubtitle: {
    fontSize: 20,
    color: Themes.colors.orange,
    fontFamily: 'Poppins-Bold',
  },
  tripsList: {
    alignSelf: 'center',
    paddingTop: 10,
  },
  signoutContainer: {
    alignSelf: 'flex-end',
    paddingRight: 20,
  },
  signoutText: {
    color: Themes.colors.darkGray,
    fontFamily: 'Poppins',
    fontSize: 14,
  },
});

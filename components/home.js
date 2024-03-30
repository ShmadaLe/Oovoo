import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Themes } from "../assets/themes";
import Trip from "./trip.js"
import HorizontalSlider from './horizontalslider.js';
import { auth, getAllTripsFromFirestore, getCommunitiesFromFirestore } from '../firebase'
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [communityData, setCommunityData] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false)
  currentUser = auth.currentUser;

  const onRefresh = async() => {
    console.log('Refreshing home page...')
    setRefreshing(true)
    try {
      const fetchedCommunities = await getCommunitiesFromFirestore()
      setCommunityData(fetchedCommunities)
      const fetchedTrips = await getAllTripsFromFirestore()
      setUserTrips(fetchedTrips)
    } catch (error) {
      console.error('Error fetching community and/or trip data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // hook to await user data from firestore, that sets the userData state
  useEffect(() => {
    const fetchData = async () => {
      try {
        await onRefresh()
      } catch (error) {
        console.error('Error fetching data on home page:', error)
      }
    }
    fetchData()
  }, []);

  const renderTrip = ({item}) => {
    let tripDocumentId = item.community_handle + '_' + item.source + '_' + item.destination + '_' + item.date.toDate()

    return (
      <TouchableOpacity onPress={ () => navigation.push('TripHome', {documentId: tripDocumentId}) }>
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
    <SafeAreaView style={ styles.container } >
      <View>
        <HorizontalSlider navigation={ navigation } communities={ communityData }/>
      </View>
      <Text style={styles.title}>Upcoming Trips</Text>
      <View>
        {/* TripList stuff */}
        <FlatList
          data = {userTrips}
          renderItem = {(item) => renderTrip(item)}
          keyExtractor = {(_, i) => i}
          style = {styles.tripContainer}
          onRefresh = {onRefresh}
          refreshing = {refreshing}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: Themes.colors.orange,
    fontFamily: 'Poppins-Bold',
    alignSelf: 'flex-start',
    marginVertical: 8,
    paddingLeft: 16,
  },
  tripContainer: {
    backgroundColor: Themes.colors.background,
    flex: 1,
    width: Dimensions.get('window').width - 35,
    marginBottom: 50
  }
});

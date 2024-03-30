import {React, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Themes } from "../../assets/themes/index.js";
import TripDetails from "./tripdetails.js";
import TripVehicle from "./tripvehicle.js";
import BackArrowNavBar from "../backarrownavbar.js";
import { getDocFromFirestore, getTripVehiclesFromFirestore } from "../../firebase.js";

export default function TripHomeScreen({ navigation, route }) {
  const { documentId } = route.params
  const [tripData, setTripData] = useState(null)
  const [vehiclesData, setVehiclesData] = useState(null)

  let updateData = useCallback(async () => {
    try {
      const trip = await getDocFromFirestore("trips", documentId)
      setTripData(trip)
      const vehicles = await getTripVehiclesFromFirestore(documentId)
      setVehiclesData(vehicles)
      console.log("gotten trip and vehicle info")
    } catch (error) {
      console.error('Error fetching trip data:', error)
    }
  },[documentId]);

  useEffect(() => {
    updateData();
  }, [updateData])

  return tripData && vehiclesData ? (
    <SafeAreaView style={styles.container}>
      <BackArrowNavBar navigation={navigation} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Trip Details</Text>
      </View>
      <TripDetails
        navigation={navigation}
        trip={tripData}
      />
      <View style={styles.carsContainer}>
        <ScrollView>
          {vehiclesData.map((vehicle, index) => {
            return <TripVehicle key={index} vehicle={vehicle} onJoin={() => {}} tripDocId={documentId} updateData={updateData} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  ) : <SafeAreaView></SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: "center",
  },
  carsContainer: {
    width: Dimensions.get("window").width - 35,
    height: Dimensions.get("window").height,
  },
  header: {
    alignItems: "center",
    width: Dimensions.get("window").width - 35,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Poppins",
    color: Themes.colors.black,
  },
});

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Themes, Images } from "../../assets/themes";
import BackArrowNavBar from "../backarrownavbar.js";
import OrangeButton from '../orangeButton.js';
import { getUserVehiclesFromFirestore, writeTripVehicleToFirestore, writeVehicleDataToFirestore } from "../../firebase.js";
import uuid from 'react-native-uuid'
import { getAuth } from "firebase/auth";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function YourVehicles({ navigation, route }) {
  const { trip } = route.params
  const [vehiclesData, setVehiclesData] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [meetingSpot, setMeetingSpot] = useState(null);
  currentUser = getAuth().currentUser

  let uber = {
    "car_id": "uber_" + uuid.v4(),
    "total_num_seats": 4,
    "user_id": currentUser.uid,
    "vehicle_model": "Uber",
    "passengers": []
  }

  let uberXL = {
    "car_id": "uberXL_" + uuid.v4(),
    "total_num_seats": 6,
    "user_id": currentUser.uid,
    "vehicle_model": "UberXL",
    "passengers": []
  }

  useEffect(() => {
    async function getVehicles() {
      vehicles = await getUserVehiclesFromFirestore()

      setVehiclesData(vehicles)
    }

    getVehicles()
  }, [])

  const handleAddTripVehicle = (navigation) => {
    if (selectedVehicle && departureTime && meetingSpot) {
      let carDocId = null
      if (selectedVehicle == "Uber" || selectedVehicle == "UberXL") {
        data = selectedVehicle == "Uber" ? uber : uberXL
        carDocId = selectedVehicle == "Uber" ? uber.car_id : uberXL.car_id
        writeVehicleDataToFirestore(data)
      } else {
        carDocId = selectedVehicle["car_id"]
      }

      let tripVehicle = {
        "car_id": carDocId,
        "departure_time": departureTime,
        "meeting_spot": meetingSpot,
        "passengers": [currentUser.uid]
      }
      
      // write car to trip in firestore
      let tripDocId = trip["community_handle"] + "_" + trip["source"] + "_" + trip["destination"] + "_" + trip["date"].toDate()
      writeTripVehicleToFirestore(tripDocId, tripVehicle)

      navigation.popToTop()
      navigation.navigate('TripHome', {documentId: tripDocId})
    } else {
      Alert.alert('Error', 'You must input a vehicle, departure time, and meeting spot!')
    }
  }

  const handleItemPress = (item) => {
    setSelectedVehicle(item)
  }

  const renderVehicle = ({ item }) => {
    return (
      <View style={styles.splitContainer}>
        <View style={styles.left}>
          <View style={styles.circle}>
            <Image source={Images.car} style={styles.image}></Image>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.black_h2}>{item.vehicle_model}</Text>
          <Text style={styles.gray_h1}>{item.total_num_seats} Seats</Text>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.littleCircle, selectedVehicle === item ? { backgroundColor: Themes.colors.orange } : null]}
            onPress={() => handleItemPress(item)}>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const RideshareOption = ({ option }) => (
    <View style={styles.splitContainer}>
      <View style={styles.left}>
        <Text style={styles.black_h1}>{option}</Text>
      </View>
      <View style={[styles.right, { alignItems: 'flex-end' }]}>
        <TouchableOpacity
          style={[styles.littleCircle, selectedVehicle === option ? { backgroundColor: Themes.colors.orange } : null]}
          onPress={() => handleItemPress(option)}>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <BackArrowNavBar navigation={navigation}></BackArrowNavBar>

      {/* Your Vehicles Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Your Vehicles ({vehiclesData.length})</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddNewVehicle", {trip: trip})}>
        <Text style={styles.black_h3}>+ Add New Vehicle</Text>
      </TouchableOpacity>

      <FlatList
        data={vehiclesData}
        renderItem={(item, i) => renderVehicle(item)}
        keyExtractor={(_, i) => i}
        style={{ maxHeight: 150 }}
      />

      {/* Rideshare App Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Rideshare App</Text>
      </View>

      <RideshareOption option="Uber" />
      <RideshareOption option="UberXL" />
      <View style={styles.line}></View>

      {/* Departure Details Section */}
      <View style={styles.splitContainer}>
        <View style={styles.left}>
          <Text style={styles.orangeText}>Estimated Departure Time:</Text>
          <Text style={styles.gray_h1}>Ex: 5:30PM</Text>
        </View>
        <View style={styles.right}>
          <DateTimePicker
              mode='time'
              display='clock'
              value={departureTime}
              onChange={(_, input) => setDepartureTime(input)}
              themeVariant="light"
            />
        </View>
      </View>

      <View style={styles.splitContainer}>
        <View style={styles.left}>
          <Text style={styles.orangeText}>Meeting Spot:</Text>
          <Text style={styles.gray_h1}>Ex: EVGR Loop</Text>
        </View>
        <View style={styles.right}>
          <TextInput
            value={meetingSpot}
            onChangeText={text => setMeetingSpot(text)}
            style={styles.textInputBox}
          />
        </View>
      </View>

      {/* Add Button Section */}
      <OrangeButton onPressFunction={handleAddTripVehicle} navigation={navigation} text="Add"></OrangeButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: "center",
  },
  splitContainer: {
    flexDirection: 'row',
    alignItems: 'left',
    marginVertical: 8,
    width: Dimensions.get('window').width - 50,
  },
  left: {
    marginRight: 10
  },
  right: {
    flex: 0.99,
    paddingBottom: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Themes.colors.orange,
    justifyContent: 'center',
    alignItems: 'center'
  },
  littleCircle: {
    width: 28,
    height: 28,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Themes.colors.orange,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
    paddingBottom: 8,
    marginBottom: 20,
    width: Dimensions.get('window').width - 35,
  },
  button: {
    backgroundColor: Themes.colors.white,
    width: 175,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderColor: Themes.colors.orange,
    borderWidth: 1,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: Themes.colors.black,
    fontFamily: "Poppins",
  },
  black_h1: {
    fontSize: 22,
    fontFamily: "Poppins",
  },
  black_h2: {
    fontSize: 16,
    fontFamily: "Poppins",
  },
  black_h3: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  gray_h1: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: Themes.colors.darkGray
  },
  orangeText: {
    fontSize: 18,
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
  },
  line: {
    height: 1,
    backgroundColor: Themes.colors.lightGray,
    width: Dimensions.get('window').width - 35,
    marginVertical: 20,
  },
  textInputBox: {
    backgroundColor: Themes.colors.textInput,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Poppins',
    paddingLeft: 10,
    height: 25
  },
})

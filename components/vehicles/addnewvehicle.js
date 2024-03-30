import { StyleSheet, Text, View, SafeAreaView, Dimensions, TextInput } from "react-native";
import { useState } from "react";
import { Themes } from "../../assets/themes";
import BackArrowNavBar from "../backarrownavbar.js";
import OrangeButton from '../orangeButton.js';
import { getAuth } from "firebase/auth";
import { writeVehicleDataToFirestore } from "../../firebase.js";
import uuid from 'react-native-uuid'

export default function AddNewVehicle({ navigation, route }) {
  const { trip } = route.params
  const [makeAndModel, setMakeAndModel] = useState(null)
  const [numSeats, setNumSeats] = useState(null)
  const [licensePlate, setLicensePlate] = useState(null)

  const handleAddVehicle = ( navigation ) => {
    if (makeAndModel && numSeats && licensePlate) {
      currentUser = getAuth().currentUser
      data = {
        "car_id": uuid.v4(),
        "license_plate": licensePlate,
        "total_num_seats": numSeats,
        "user_id": currentUser.uid,
        "vehicle_model": makeAndModel,
        "passengers": []
      }
      writeVehicleDataToFirestore(data)

      navigation.popToTop()
      navigation.navigate('YourVehicles', { trip: trip })
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <BackArrowNavBar navigation={navigation}></BackArrowNavBar>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Add New Vehicle</Text>
      </View>

      <View style={ styles.entryContainer }>
        <Text style={ styles.orangeText }>Vehicle Make and Model</Text>
        <TextInput
          value={makeAndModel}
          onChangeText={text => setMakeAndModel(text)}
          style={styles.input}
        />
      </View>

      <View style={ styles.entryContainer }>
        <Text style={ styles.orangeText }>Total Number of Seats (incl. driver)</Text>
        <TextInput
          value={numSeats}
          onChangeText={text => setNumSeats(text)}
          style={[styles.input, {width: 30}]}
        />
      </View>

      <View style={ styles.entryContainer }>
        <Text style={ styles.orangeText }>License Plate</Text>
        <TextInput
          value={licensePlate}
          onChangeText={text => setLicensePlate(text)}
          style={[styles.input, {width: 80}]}
        />
      </View>

      {/* Add Button Section */}
      <OrangeButton onPressFunction={ handleAddVehicle } navigation={ navigation } text="Add"></OrangeButton>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
    paddingBottom: 8,
    marginBottom: 20,
    width: Dimensions.get('window').width - 35,
  },
  entryContainer: {
    width: Dimensions.get('window').width - 50,
    alignContent: 'left',
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: Themes.colors.black,
    fontFamily: "Poppins",
  },
  orangeText: {
    fontSize: 18,
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
    paddingBottom: 3,
    paddingTop: 20,
  },
  input: {
    backgroundColor: Themes.colors.textInput,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Poppins',
    paddingLeft: 10,
  },
});

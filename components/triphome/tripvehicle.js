import { React, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Themes, Images } from "../../assets/themes";
import { auth, writePassengerToFirestore, writeRemovePassengerToFirestore } from '../../firebase';
import moment from 'moment';

export default function TripVehicle ({ vehicle, tripDocId, updateData }) {
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const JoinVehicleButton = ({ title, func }) => (
    joining ? 
    <View style={styles.buttonContainer}>
      <Text style={styles.blackSubtext}>Joining...</Text>
    </View>
    : ( leaving ?
      <View style={styles.buttonContainer}>
        <Text style={styles.blackSubtext}>Leaving...</Text>
      </View>
      :
      <TouchableOpacity onPress={func} style={styles.buttonContainer}>
        <Text style={styles.blackSubtext}>{title}</Text>
      </TouchableOpacity>
    )
  );
  
  const addToVehicle = async (tripDocId, vehicle, updateData) => {
    setJoining(true);
    const currentUser = auth.currentUser
    if (!vehicle.passengers.includes(currentUser.uid)) {
      try {
        await writePassengerToFirestore(tripDocId, vehicle)
      } catch (error) {
        console.error('Error adding passenger to vehicle', error)
      }
    }
    await updateData();
    setJoining(false);
  };
  
  const removeFromVehicle = async (tripDocId, vehicle, updateData) => {
    setLeaving(true);
    const currentUser = auth.currentUser
    if (vehicle.passengers.includes(currentUser.uid)) {
      try {
        await writeRemovePassengerToFirestore(tripDocId, vehicle)
      } catch (error) {
        console.error('Error adding passenger to vehicle', error)
      }
    }
    await updateData();
    setLeaving(false);
  };

  const formatTime = (rawTime) => {
    const time = rawTime.toDate();
    return moment(time).format("h:mmA");
  };

  return(
    <View style={styles.container}>
      <View style={styles.vehicleIconContainer}>
        <View style={styles.circle}>
          <Image source={ Images.car } style={styles.image} />
        </View>
        <Text style={styles.graySubtext}>{formatTime(vehicle.departure_time)}</Text>
      </View>

      <View style={styles.vehicleDescriptionContainer}>
        <Text style={styles.blackText}>
          {vehicle.username}'s {vehicle.vehicle_model.includes("Uber") ? vehicle.vehicle_model : "Car"}
        </Text>
        <Text style={styles.graySubtext}>{vehicle.vehicle_model}</Text>
        <Text style={styles.graySubtext}>
          {"Pickup at " + vehicle.meeting_spot}
        </Text>
      </View>
      <View style={styles.joinVehicleContainer}>
        {vehicle.passengers.includes(currentUser.uid) ? (
          <JoinVehicleButton title="Joined!" func={() => removeFromVehicle(tripDocId, vehicle, updateData)}/>
        ) : vehicle.passengers.length >= vehicle.capacity - 1 ? (
          <JoinVehicleButton title="Full" func={() => {}} />
        ) : (
          <JoinVehicleButton title="+ Join Car" func={() => addToVehicle(tripDocId, vehicle, updateData)} />
        )}
        <Text style={styles.graySubtext}>
          {vehicle.passengers.length}/{vehicle.total_num_seats} Full
        </Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
  },
  vehicleIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Themes.colors.orange,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  vehicleDescriptionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "left",
  },
  buttonContainer: {
    justifyContent: "center",
    overflow: "hidden",
    borderColor: Themes.colors.orange,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 1,
    marginVertical: 2,
  },
  graySubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: Themes.colors.darkGray,
  },
  blackSubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
  blackText: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: Themes.colors.black,
  },
  joinVehicleContainer: {
    alignItems: "flex-end",
  },
  vehicleIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  vehiclePassengersContainer: {
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "left",
  },
  passengerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 1,
  },
});

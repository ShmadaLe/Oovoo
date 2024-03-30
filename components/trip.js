import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Themes } from "../assets/themes";
import CircularIcon from "./circularicon";
import moment from 'moment';

export default function Trip({navigation, imageURL, tripOrganizer, tripOrganizerHandle, tripSource, tripDestination, tripDate, tripMembers}) {
  const documentId = tripOrganizerHandle + '_' + tripSource + '_' + tripDestination + '_' + tripDate
  
  const formatDate = (date) => {
    return moment(date).format("MMM Do, YYYY");
  };

  const formatTime = (date) => {
    return moment(date).format("h:mmA");
  };

  return (
    <TouchableOpacity onPress={ () => navigation.navigate("TripHome", { documentId: documentId }) }>
      <View style={ styles.container }>
        <View style={styles.left}>
          <CircularIcon imageURL={imageURL}/>
        </View>
        <View style={styles.right}>
          <Text style={styles.title}>
            {/* instead of text wrapping, can also replaced off-screen text with ellipses */}
            <Text style={styles.titleBold}>{ tripOrganizer }</Text> from { tripSource } to { tripDestination }
          </Text>
          <Text style={styles.date}>{ formatDate(tripDate) }</Text>
          <Text style={styles.estDeparture}>Est. Departure {formatTime(tripDate)}</Text>
        </View>
      </View> 
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Themes.colors.white,
    alignItems: 'left',
    marginTop: 10,
    marginBottom: 8,
  },
  left: {
    marginRight: 10
  },
  right: {
    flex: 0.99,
    borderBottomWidth: 1,
    borderBottomColor: Themes.colors.lightGray,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'left',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    marginBottom: 2,
  },
  titleBold: {
    fontSize: 19,
    color: Themes.colors.black,
    fontFamily: 'Poppins-Bold',
  },
  date: {
    fontSize: 13,
    textAlign: 'left',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    marginBottom: 1,
  },
  estDeparture: {
    fontSize: 13,
    textAlign: 'left',
    color: Themes.colors.lightGray,
    fontFamily: 'Poppins',
  },
});

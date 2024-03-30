import { StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Themes } from "../assets/themes";
import { useNavigation } from '@react-navigation/native';

import Trip from "./trip.js"

export default function TripList({ trips }) {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
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
    <FlatList
      data = {trips}
      renderItem={(item) => renderItem(item)}
      keyExtractor={(_, i) => i}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    flex: 1,
    width: Dimensions.get('window').width - 35,
    marginBottom: 50
  },
})
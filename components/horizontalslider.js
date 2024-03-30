import { View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Themes } from "../assets/themes";

import CircularIcon from "./circularicon.js";

export default function HorizontalSlider({ navigation, communities }) {

  const renderHeader = () => {
    return (
      <View style={styles.communitiesContainer}>
        <TouchableOpacity onPress={() => navigation.push('SearchCommunities', { navigation })} style={styles.trip}>
          <CircularIcon iconName={"search-outline"} bottomMargin={8}/>
          <Text style={styles.subtext}>Search</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.communitiesContainer}>
        <TouchableOpacity onPress={ () => navigation.push('CommunityHome', { navigation, community: item }) }>
          <CircularIcon imageURL={item.community_picture} bottomMargin={8}/>
          <Text style={styles.subtext} ellipsizeMode='tail' numberOfLines={1}>{ item.community_name }</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={communities}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={(item) => renderItem(item)}
      keyExtractor={(item) => item.community_handle}
      style={styles.container}
      ListHeaderComponent={renderHeader}
    />
  )
}

const styles = StyleSheet.create({
  communitiesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    marginLeft: 2,
    marginRight: 2
  },
  subtext: {
    fontSize: 12,
    textAlign: 'center',
    color: Themes.colors.lightGray,
    fontFamily: 'Poppins',
  },
  container: {
    flexGrow: 0,
    width: Dimensions.get('window').width - 35,
    marginTop: 5,
    marginBottom: 10
  },
});

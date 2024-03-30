import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Themes } from "../assets/themes";
import BackArrowNavBar from "./backarrownavbar.js";
import { useState, useEffect } from 'react';
import CircularIcon from "./circularicon.js";
import filter from 'lodash.filter';
import { auth, getAllDocuments } from '../firebase'

// https://www.youtube.com/watch?v=Q4S9M9rJAxk
export default function SearchCommunity({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [userInCommunity, setUserInCommunity] = useState({});
  user = auth.currentUser;

  // hook to await user data from firestore, that sets the userData state
  useEffect(() => {
    async function updateData() {
        const communities = await getAllDocuments("communities");
        setAllData(communities);
        setFilteredData(communities);
        setUserInCommunity(checkInCommunity(communities));
    }
    updateData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filtered = filter(allData, (community) => {
      return contains(community, formattedQuery);
    });
    setFilteredData(filtered);
  }

  const checkInCommunity = (possibleCommunities) => {
    let inCommunity = {};
    possibleCommunities.forEach(function(item) {
      if (item["members"].includes(user.displayName)) {
        inCommunity[item["community_handle"]] = true;
      } else {
        inCommunity[item["community_handle"]] = false;
      }
    });
    return inCommunity;
  }

  const contains = ({community_name, community_handle}, query) => {
    if (community_name.toLowerCase().includes(query) || community_handle.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        onPress={() => {
            if (userInCommunity[item["community_handle"]]) {
                navigation.push('CommunityHome', { navigation, community: item })
            } else {
                navigation.push('NonMemberCommunity', { navigation, community: item })
            }
        }} 
        style={ styles.communityContainer }
      >
        <CircularIcon imageURL={item.community_picture}/>
        <View style={ styles.communityInfo }>
          <Text style={ styles.communityName }>{ item.community_name }</Text>
          <Text style={ styles.communityHandle }>@{ item.community_handle }</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <BackArrowNavBar navigation={ navigation }></BackArrowNavBar>
      <View style={ styles.header }>
        <Text style={ styles.title }>
          Search All Communities
        </Text>
      </View>
      <View style={ styles.search }>
        <SearchBar 
          platform='ios'
          placeholder='Search communities' 
          placeholderTextColor="#9A9A9A" 
          containerStyle={ styles.searchBarContainer }
          inputStyle={ styles.searchBarInput }
          inputContainerStyle={ styles.searchBarInputContainer }
          searchIcon={{ name: 'search', color: '#B7B7B7' }}
          clearIcon={{ name: 'close-circle', color: '#B7B7B7' }}
          cancelButtonProps={{ buttonTextStyle: styles.cancelButton }}
          value={ searchQuery }
          onChangeText={ (query) => handleSearch(query) }
          autoCapitalize='none'
          autoCorrect={ false }
        />
        <FlatList
          data={filteredData}
          renderItem={(item) => renderItem(item)}
          keyExtractor={(item) => item.community_handle}
          style={ styles.listContainer }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    paddingBottom: 20,
  },
  header: {
    borderBottomWidth: 1,
    width: '70%',
  },
  search: {
    width: '90%',
    paddingTop: 20,
    borderRadius: 10,
  },
  searchBarContainer: {
    height: 30,
    borderRadius: 5,
  },
  searchBarInputContainer: {
    backgroundColor: Themes.colors.textInput, 
    borderRadius: 5,
    margin: 0,
  },
  searchBarInput: {
    fontFamily: 'Poppins',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  cancelButton: {
    fontFamily: 'Poppins', 
    fontSize: 16,
  },
  listContainer: {
    marginTop: 5,
    marginBottom: 60,
    marginLeft: 10,
    marginRight: 10,
  },
  communityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    borderBottomColor: Themes.colors.lightGray,
    borderBottomWidth: 1
  },
  communityName: {
    fontFamily: 'Poppins',
    fontSize: 20,
  },
  communityHandle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: Themes.colors.darkGray,
  },
  communityInfo: {
    paddingLeft: 15,
  }
});

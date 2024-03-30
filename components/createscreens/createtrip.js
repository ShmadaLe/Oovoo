import React, { useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { Themes } from "../../assets/themes";
import BackArrowNavBar from "../backarrownavbar.js";
import OrangeButton from '../orangeButton.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import { writeTripDataToFirestore } from '../../firebase.js';
import { getAuth } from "firebase/auth";

export default function CreateTrip({ navigation, route }) {
  const { community } = route.params;
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  
  const create = async ( navigation ) => {
    if (!from || !to || !dateTime) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      currentUser = getAuth().currentUser;
      data = {
        "community_handle": community.community_handle, 
        "community_name": community.community_name,
        "community_picture": community.community_picture,
        "trip_id": 8, 
        "source": from, 
        "destination": to, 
        "date": dateTime,
        "trip_cars": [],
        "trip_members": [currentUser.displayName]
      };
      await writeTripDataToFirestore(data);
      let documentId = community.community_handle + '_' + from + '_' + to + '_' + dateTime
      navigation.popToTop(); 
      navigation.navigate('Home'); 
      navigation.navigate('TripHome', {documentId: documentId});
    } catch (error) {
      console.error('Error creating trip:', error)
    }
  };

  return (
    <SafeAreaView style={ styles.container }>
      <BackArrowNavBar navigation={ navigation }></BackArrowNavBar>
      <KeyboardAvoidingView behavior="padding" style={ styles.container }>
        <View style={ styles.header }>
          <Text style={ styles.title }>
            Create a Trip
          </Text>
        </View>

        <View style={ styles.communityContainer }>
          <View style={ styles.circle }>
            <Image source={{ uri: community.community_picture }} style={ styles.image }></Image>
          </View>
          <Text style={ styles.communityName }>
            { community.community_name }
          </Text>
          <View style={ styles.communityInfoContainer }>
              <Text style={ styles.communityInfoText }>
                @{ community.community_handle } · { community.num_members } members
              </Text>
          </View>
        </View>
        

        <View style={ styles.inputSection }>
          <Text style={ styles.subtitle }>
            From:
          </Text>
          <TextInput
            value={ from }
            onChangeText={ text => setFrom(text) }
            style={ styles.textInput }
          />
          <Text style={ styles.subtitle }>
            To:
          </Text>
          <TextInput
            value={ to }
            onChangeText={ text => setTo(text) }
            style={ styles.textInput }
          />
          <View style={ styles.inlineContainer }>
            <Text style={ [styles.subtitle, {paddingBottom: 0, paddingTop: 0}] }>
              Date:
            </Text>
            <DateTimePicker
              mode='date'
              display='calendar'
              value={dateTime}
              onChange={(_, input) => setDateTime(input)}
              themeVariant="light"
            />
          </View>
          <View style={ styles.inlineContainer }>
            <Text style={ [styles.subtitle, {paddingBottom: 0, paddingTop: 0}] }>
            Est. Departure Time:
            </Text>
            <DateTimePicker
              mode='time'
              display='clock'
              value={dateTime}
              onChange={(_, input) => setDateTime(input)}
              themeVariant="light"
            />
          </View>
        </View>
        <OrangeButton onPressFunction={ create } navigation={ navigation } text="Create"></OrangeButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: Themes.colors.orange,
    fontFamily: 'Poppins',
    paddingBottom: 3,
    paddingTop: 20,
  },
  header: {
    borderBottomWidth: 1,
    width: '70%',
    alignSelf: 'center',
  },
  inputSection: {
    marginLeft: 30,
    marginRight: 30,
  },
  textInput: {
    backgroundColor: Themes.colors.textInput,
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'Poppins',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    width: '100%',
  },
  communityContainer: {
    paddingTop: 25,
  },
  circle: {
    width: 125, 
    height: 125, 
    borderRadius: 125 / 2,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Themes.colors.lightGray,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  communityName: {
    fontSize: 20,
    color: Themes.colors.black,
    fontFamily: 'Poppins',
    alignSelf: 'center',
    paddingTop: 10,
  },
  communityInfoContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  communityInfoText: {
    fontSize: 12,
    color: Themes.colors.darkGray,
    fontFamily: 'Poppins',
    alignSelf: 'center',
  },
  inlineContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingBottom: 3,
    paddingTop: 20,
  },
});
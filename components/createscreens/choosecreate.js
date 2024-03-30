import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Themes, Images } from "../../assets/themes";
import { Ionicons } from '@expo/vector-icons';

export default function ChooseCreate({ navigation }) {
  return (
    <SafeAreaView style={ styles.container }>
      <TouchableOpacity onPress={() => navigation.goBack()} style={ styles.cancel }>
        <Ionicons name='close-outline' size={ 36 } color={ Themes.colors.grayButton }/>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.push('Create Trip Search')} style={ styles.trip }>
        <Image source={ Images.create_trip } style={ styles.icons }/>
        <Text style={ styles.subtitle }>
          Trip
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.push('Create Community')} style={ styles.community }>
        <Image source={ Images.create_community } style={ styles.icons }/>
        <Text style={ styles.subtitle }>
          Community
        </Text>
      </TouchableOpacity>      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
  },
  subtitle: {
    fontSize: 20,
    color: Themes.colors.black,
    fontFamily: 'Poppins',
  },
  icons: {
    width: 170,
    height: 200,
    resizeMode: 'contain'
  },
  cancel: {
    paddingLeft: 25,
  },
  trip: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Themes.colors.darkGray,
    borderRadius: 50,
  },
  community: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

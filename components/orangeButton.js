import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Themes } from "../assets/themes";

export default function OrangeButton({ onPressFunction, navigation, additionalParameter, text }) {
  return (
    <TouchableOpacity 
      onPress={() => onPressFunction( navigation, additionalParameter )} 
      style={ styles.button }
    >
      <Text style={ styles.text }>
        { text }
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Themes.colors.orange,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20,
    position: 'absolute',
    bottom: 40,
  },
  text: {
    color: Themes.colors.white,
    fontFamily: 'Poppins',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  }
});

import { View, StyleSheet, Image } from "react-native";
import { Themes, Images } from "../assets/themes";
import { Ionicons } from '@expo/vector-icons';

let circleDiameter = 55

export default function CircularIcon({ imageURL, iconName, bottomMargin }) {
  return (
    <View style={[{marginBottom: bottomMargin,}, styles.circle]}>
      {imageURL ?
        <Image source={{ uri:imageURL }} style={styles.image}></Image> :
        <Ionicons name={ iconName } color={ Themes.colors.searchIcon } size={30} />}
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    width: circleDiameter, 
    height: circleDiameter, 
    borderRadius: circleDiameter,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Themes.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
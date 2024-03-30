import { StyleSheet} from 'react-native';
import { Themes } from "../assets/themes";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

export default function BackArrowNavBar({ navigation }) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={ () => navigation.goBack() }>
      <Ionicons
        name="arrow-back-outline"
        size={ 30 }
        color={ Themes.colors.grayButton }
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 25,
    alignSelf: "flex-start",
  }
});

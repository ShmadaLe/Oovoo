import { View, StyleSheet, Text } from "react-native";
import { Themes } from "../assets/themes";

export default function Member({ member }) {
  return (
    <View style={ styles.container }>
        <View style={styles.right}>
            <Text style={styles.title}>{ member }</Text>
        </View>
    </View> 
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
});

import { StyleSheet, FlatList, Dimensions } from "react-native";
import { Themes } from "../assets/themes";

import Member from "./member.js"

export default function MemberList({ members }) {

  const renderItem = ({ item }) => {
    return (
        <Member member={ item }/>
    )
  }

  return (
    <FlatList
      data = {members}
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
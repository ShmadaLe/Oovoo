import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Themes } from "../assets/themes";
import BackArrowNavBar from "./backarrownavbar.js";

import MemberList from "./memberlist.js"

export default function Members({ navigation, route }) {
    const { community } = route.params;
    return (
        <SafeAreaView style={ styles.container }>
            <View style={ styles.navContainer }>
                <View style={styles.backButton}>
                    <BackArrowNavBar navigation={ navigation } />
                </View>
            </View>
            <Text style={ styles.title }>Members</Text>
            <View style={styles.line}></View>
            <MemberList members={ community["members"] }/>
        </SafeAreaView>
    )
  }

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        backgroundColor: Themes.colors.white,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        color: Themes.colors.black,
        fontFamily: 'Poppins',
        fontWeight: 400,
        height: 30,
        width: 147,
        marginBottom: 10,
    },
    backButton: {
        left: -185,
    },
    line: {
        height: 1,
        backgroundColor: Themes.colors.black,
        width: '90%',
        marginBottom: 10,
    },
});
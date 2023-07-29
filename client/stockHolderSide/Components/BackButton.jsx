
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";

function BackButton({ text }) {
    const navigation = useNavigation();
    return (
        <View style={styles.hamburger}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back-outline" size={30} color='#144800' />
            </TouchableOpacity>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
    },
    hamburger: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        height: '12%',
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 55,
        paddingHorizontal: 20,
        shadowOpacity: 0.95,
    },
    text: {
        color: '#144800',
        fontSize: 32,
        alignSelf: 'center',
        paddingLeft: 30,
    }
});

export default BackButton;
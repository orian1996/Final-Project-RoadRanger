import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import React from 'react'
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import GradientBackground from '../Components/GradientBackground';

import { cgroup90 } from '../cgroup90';

export default function ForgotPassword() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handleSendPress = () => {
        travelerEmail = {
            "travler_email": email
        }
        console.log(travelerEmail);
        fetch(`${cgroup90}/api/post/forgotpassword`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(travelerEmail),

        })
            .then(response => response.json())
            .then(data => {
                Alert.alert("New password send to your email")
                navigation.goBack();
            })
            .catch(error => {
                Alert.alert("Email does not exist");
            });

    };
    return (
        < GradientBackground>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={35} color='#144800' />
                </TouchableOpacity>
                <Text style={styles.title}>Forgot Your Password?</Text>

                <Text style={styles.text}>Email:</Text>
                <TextInput style={styles.input}
                    placeholder="User Email"
                    onChangeText={(text) => setEmail(text)}>
                </TextInput>


                <TouchableOpacity style={styles.btnLogIn} onPress={handleSendPress}>
                    <Text style={styles.btnText}>
                        Reset Password
                    </Text>
                </TouchableOpacity>
            </View >
        </ GradientBackground>

    )
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 10,
        width: "100%",

    },
    title: {
        paddingTop: 50,
        fontSize: 40,
        marginBottom: 50
    },

    RoadRanger: {
        alignSelf: 'center',
        resizeMode: 'contain',
        height: 100

    },
    text: {
        paddingTop: 10,
        color: '#144800',
        fontSize: 20,
    },
    input: {
        marginVertical: 10,
        width: "90%",
        fontSize: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnLogIn: {
        marginVertical: 20,
        width: "50%",
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 2,
        borderRadius: 25,
        backgroundColor: '#144800'
    },
    btnText: {
        color: '#F8F8FF',
        alignSelf: 'center',
        fontSize: 20,
    },
    placeholderStyle: {
        fontSize: 18,
        color: "#A9A9A9"
    },

    dropdown: {
        height: 40,
        borderColor: '#8FBC8F',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        marginTop: 10,
        width: "90%",
    },
    input1: {
        flexDirection: 'row',
        marginVertical: 10,
        width: "90%",
        fontSize: 20,
        paddingVertical: 70,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 25,
    },
    error: {
        color: 'red'
    },
    success: {
        color: '#144800'
    },
    button: {
        left: 5,
        top: 30,
    }
});
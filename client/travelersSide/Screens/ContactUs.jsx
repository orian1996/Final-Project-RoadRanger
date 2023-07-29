import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import {  useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import GradientBackground from '../Components/GradientBackground';
import { Dropdown } from 'react-native-element-dropdown';
import { cgroup90 } from '../cgroup90';


export default function ContactUs() {
    const Subject = [
        { label: 'General', value: '1' },
        { label: 'Help', value: '2' },
        { label: 'Question', value: '3' },
        { label: 'Create a stakeholder', value: '4' },
        { label: 'Faults', value: '5' },
    ]
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [requestType, setRequestType] = useState('');
    const [details, setDetails] = useState('');
    const [requestTypeSelection, setRequestTypeSelection] = useState(null);

    const navigation = useNavigation();
    state = {
        showPassword: false
    };

    const sendRequest = () => {
        const objNewContactRequest = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Date: new Date().toISOString().slice(0, 10),
            Time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            PhoneNumber: phoneNumber,
            RequestType: requestType,
            Details: details
        };
       
        if (!firstName || !lastName | !email || !phoneNumber || !details || !requestType) {
            // Some fields are missing
            Alert.alert('Please fill in all fields.');
            return;
        }
        // Email validation
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!emailPattern.test(email)) {
            // Email format is invalid
            Alert.alert('Please enter a valid email address.');
            return;
        }
        if (phoneNumber.length != 10) {
            // Phone is too short
            Alert.alert('Phone must be 10 numbers.');

            return;
        }
        fetch(`${cgroup90}/api/newcontactus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objNewContactRequest),


        })
            .then(response => response.json())
            .then(data => {
                // Handle the response data as needed
                Alert.alert('Thank you for your message. Your message is important to us :)')
                setDetails('')
                setEmail('')
                setFirstName('')
                setLastName('')
                setRequestType('')
                setPhoneNumber('')
                navigation.goBack()
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', error);
            });
    }
    return (
        < GradientBackground>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-outline" size={35} color='#144800' />
                    </TouchableOpacity>
                    <View style={styles.container}>
                        <Text>Be sure to leave an accurate message so we can get back to you as soon as possible  </Text>
                        <Text style={styles.text}>Email:</Text>
                        <TextInput style={styles.input}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="Email">
                        </TextInput>
                        <Text style={styles.text}>Name:</Text>
                        <TextInput style={styles.input}
                            onChangeText={(text) => setFirstName(text)}
                            value={firstName}
                            placeholder="First Name">
                        </TextInput>
                        <TextInput style={styles.input}
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                            placeholder="Last Name">
                        </TextInput>
                        <Text style={styles.text}>Phone Number:</Text>
                        <TextInput style={styles.input}
                            placeholder="Phone"
                            value={phoneNumber}
                            keyboardType='numeric'
                            onChangeText={(text) => setPhoneNumber(text)}
                        >
                        </TextInput>
                        <Text style={styles.text}>Subject:</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={Subject}
                            labelField="label"
                            valueField="value"
                            placeholder={"select a subject type"}
                            value={requestTypeSelection}
                            onChange={item => {
                                setRequestType(item.label);
                                setRequestTypeSelection(item)
                            }}
                        />
                        <Text style={styles.text}>Message:</Text>
                        <TextInput style={styles.input1}
                            value={details}
                            onChangeText={(text) => setDetails(text)}
                            placeholder="Write here..."
                            spellCheck="true"
                            multiline={true}
                            numberOfLines={4}
                            editable={true}
                            onSubmitEditing={() => {
                                //close the keyboard
                                TextInput.State.blur(TextInput.State.currentlyFocusedInput())
                            }}
                        >
                        </TextInput>

                        <TouchableOpacity style={styles.btnLogIn} onPress={sendRequest}>
                            <Text style={styles.btnText}>
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View >
                </ScrollView>
            </KeyboardAvoidingView>
        </ GradientBackground>

    )
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 10,
        width: "100%",
        marginTop: 20
    },
    RoadRanger: {
        alignSelf: 'center',
        resizeMode: 'contain',
        height: 100
    },
    text: {
        paddingTop: 10,
        color: '#144800',
        fontSize: 25,
    },
    input: {
        flexDirection: 'row',
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
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 1,
        borderRadius: 25,
        minHeight: 120,
        textAlign: 'top',
    },
    button: {
        left: 5,
        top: 30,
        marginBottom:20
    },
});
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import Geocoder from 'react-native-geocoding';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

export default function Warning(props) {
    const navigation = useNavigation();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [events, setEvents] = useState([]);
    const traveler = props.route.params.traveler;



    useEffect(() => {
        fetch(`${cgroup90}/api/NewEvent`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data)
            });

    }, [events]);

    const [eventAddresses, setEventAddresses] = useState([]);

    useEffect(() => {
        Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
        Promise.all(
            events.filter(event => event.SerialTypeNumber == 1004).map((event) =>
                Geocoder.from(event.Latitude, event.Longitude)
                    .then((json) => json.results[0].formatted_address)
                    .catch(() => 'Address not found')
            )
        ).then((addresses) => setEventAddresses(addresses));
    }, []);
    return (
        <GradientBackground>
            <Navbar traveler={traveler} />
            <BackButton text="Warning"/>
            <ScrollView>
                <View style={styles.container}>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchKeyword}
                        onChangeText={text => setSearchKeyword(text)}
                    />
                    <View>
                        {events !== undefined && events.length > 0 ? (
                            events.filter(event => event.SerialTypeNumber == 1004 && event.Details.toLowerCase().includes(searchKeyword.toLowerCase())).map((event, index) => (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('Event Details', { event: event, traveler: traveler });
                                }} >
                                    <View style={styles.event} key={event.eventNumber}>
                                        <View style={styles.detailsContainer}>
                                            <Text style={styles.details}>{event.Details}</Text>
                                            <Text >{new Date(event.EventDate).toLocaleDateString('en-GB')}</Text>
                                            <Text >{event.EventTime.slice(0, 5)}</Text>
                                            <Text >{eventAddresses[index]}</Text>

                                        </View>
                                        <Image source={{ uri: event.Picture }} style={styles.img} />
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text>No events found.</Text>
                        )}
                    </View>
                </View>

            </ScrollView>
        </GradientBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        marginTop: 130,
        marginVertical: 10,
        marginHorizontal: 10,
        width: "100%",
        height: "100%",
        marginBottom:100
    },
    event: {
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
        borderRadius: 15,
        padding: 10,
        margin: 10,
        marginRight: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%'
    },
    detailsContainer: {
        flex: 1,
        marginRight: 10,

    },
    details: {
        width: '90%',
        marginBottom: 5,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginLeft: 10,
        resizeMode: 'cover'
    },
    btnSave: {
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
    searchInput: {
        fontSize: 35,
        marginBottom: 20
    }




});
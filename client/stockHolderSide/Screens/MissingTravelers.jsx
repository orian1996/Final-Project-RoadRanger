import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import BackButton from '../Components/BackButton';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { cgroup90 } from "../cgroup90";



export default function MissingTravelers(props) {
    const [events, setEvents] = useState([]);
    const stakeholder = props.route.params.stakeholder;
    const [loading, setLoading] = useState(true);
    const [eventAddresses, setEventAddresses] = useState([]);
    const navigation = useNavigation();

    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');

    useFocusEffect(React.useCallback(() => {
        fetch(`${cgroup90}/api/post/AllMissingTravelers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []))

    const fetchAddresses = async () => {
        const eventsWithAddress = await Promise.all(events.map(event => {
            const lat = event.Event.Latitude;
            const lng = event.Event.Longitude;
            return Geocoder.from(lat, lng).then(json => {
                const location = json.results[0].address_components;
                const number = location[0].long_name;
                const street = location[1].long_name;
                const city = location[2].long_name;
                const address = `${street} ${number}, ${city}`;
                return { ...event, address };
            });
        }));
        setEventAddresses(eventsWithAddress);
        setLoading(false);
    };
    useEffect(() => {
        if (events.length > 0) {
            fetchAddresses();
        }
    }, [events]);

    return (
        <GradientBackground>
            <BackButton text="Missing Travelers" />
            <ScrollView>
                <View style={styles.container}>
                    <View>
                        {loading ? (
                   <Image
                   source={{ uri: 'https://media.tenor.com/t5DMW5PI8mgAAAAi/loading-green-loading.gif' }}
                   style={styles.image}
                 />
                        ) : eventAddresses !== undefined && eventAddresses.length > 0 ? (
                            eventAddresses.map((event, index) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('Missing Details', { event: event, stakeholder: stakeholder });
                                    }}
                                    key={event.Event.eventNumber}
                                >
                                    <View style={styles.event}>
                                        <View style={styles.detailsContainer}>
                                            <Text style={styles.text}>{event.Event.Details}</Text>
                                            <Text>Traveler name: {event.Traveler.first_name} {event.Traveler.last_name}</Text>
                                            <Text>Last seen: {event.address}</Text>
                                            <Text>Date: {new Date(event.Event.EventDate).toLocaleDateString('en-GB')}</Text>
                                            <Text>Time: {event.Event.EventTime.slice(0, 5)}</Text>
                                        </View>
                                        <Image source={{ uri: event.Traveler.Picture }} style={styles.img} />
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
        marginTop: 120,
        marginVertical: 10,
        marginHorizontal: 10,
        width: "100%",
        height: "100%"
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
    text: {
        width: '90%',
        marginBottom: 5,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    details: {
        width: '90%',
        marginBottom: 5,
        marginBottom: 10,
        fontWeight: 'bold',

    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginLeft: 10,
        resizeMode: 'cover'
    },
    image: {
        right:50,
        top:50,
        width: 100,
        height: 100,
        alignItems:"center"
      }
});
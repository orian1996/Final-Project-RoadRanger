import React, { useState, useEffect, useContext } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import { cgroup90 } from '../cgroup90';
import { LocationContext } from '../Context/LocationContext'
import Navbar from '../Components/Navbar';


export default function AroundYou(props) {
    const { location } = useContext(LocationContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [traveler, setTraveler] = useState(props.route.params.traveler);
    const matchedEvent = props.route.params.matchedEvents;
    const [lasteventOfTraveler, setLasteventOfTraveler] = useState('');
    const [Events, setEvents] = useState([])
    const [travelerId, setTravelerId] = useState()

    useFocusEffect(
        React.useCallback(() => {
            setTravelerId(traveler.traveler_id)
            handleGet();
            return () => {
            };
        }, [isMenuOpen])
    );

    useFocusEffect(React.useCallback(() => {
            const travelerIdObj = {
                traveler_id: travelerId,
            };
            fetch(`${cgroup90}/api/traveler/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelerIdObj),
            })
                .then(response => response.json())
                .then(data => {
                    setTraveler(data)
                })
                .catch(error => {
                    console.error(error);
                });
        }, [travelerId])
    );

    useEffect(() => {
        if (matchedEvent && matchedEvent.length > 0) {
            const travelerIdObj = {
                travelerId: traveler.traveler_id,
            }
            fetch(`${cgroup90}/api/post/lastevent`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelerIdObj),
            })
                .then(response => response.json())
                .then(data => {
                    setLasteventOfTraveler(data.lastEventId);
                })
                .catch(error => {
                    console.error(error);
                    console.log('Error');
                });
        }
        setModalVisible(true);
    }, [matchedEvent]);



    const handleGet = () => {
        if (matchedEvent) {
        }
        fetch(`${cgroup90}/api/newevent`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
            .then(response => {
                return response.json()
            })
            .then(
                (result) => {
                    setEvents(result)
                },
                (error) => {
                    console.log("err post=", error);
                }, []);
    }


    const typePinColors = {
        1: 'yellow',   // Weather
        2: 'blue',     // Road closures
        3: 'green',    // Natural disasters
        4: 'red',      // Health emergencies
        5: 'purple',   // Accommodation issues
        6: 'orange',   // Protests
        7: 'pink',     // Strikes
        8: 'brown',    // Security threats
        9: 'black',    // Animal-related incidents
        10: 'gray',    // Financial issues
        1003: 'black'  //Missing traveler
    };
    AroundYou.navigationOptions = {
        headerShown: false,
    };
    
    const relatedEvent = (eventNumber) => {
        
        const updateEventObj = {
            is_related: eventNumber
        }

        fetch(`${cgroup90}/api/put/updateevent/${lasteventOfTraveler}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateEventObj),
        })
            .then((response) => response.json())
            .then((data) => {
                setModalVisible(false);
                setLasteventOfTraveler('');
                handleGet();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <GradientBackground>
            <TouchableWithoutFeedback >
                <View style={styles.container}>
                    <View style={styles.hamburger}>
                        <TouchableOpacity  onPress={() => { navigation.navigate("Setting", { traveler })}}>
                        <Image source={{ uri: traveler.Picture }} style={styles.user} />
                        </TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.titlename}>Hello,  {traveler.first_name} {traveler.last_name} !</Text>
                        </View>
                    </View>
                    <Navbar traveler={traveler} />
                    {location && location.coords && (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}>
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title="My Location"
                                description="This is my current location"
                            />
                            {Events.filter(event => event.EventStatus !== false && event.is_related == null && event.SerialTypeNumber !== 1004).map(event => (
                                <Marker
                                    key={event.EventNumber}
                                    coordinate={{
                                        latitude: event.Latitude,
                                        longitude: event.Longitude,
                                    }}
                                    title={event.Details}
                                    description={event.EventTime}
                                    pinColor={typePinColors[event.SerialTypeNumber]}
                                    onPress={() => {
                                        navigation.navigate('TimeLine', { event, traveler });
                                    }}
                                />
                            ))}
                            <Circle
                                center={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                radius={500}
                                strokeColor="#F00"
                                fillColor="#F007"
                            />
                        </MapView>
                    )}
                    <View>
                        {matchedEvent && matchedEvent.map((matchedEvent, index) => (
                            <Modal
                                key={index}
                                visible={modalVisible}
                                onRequestClose={() => setModalVisible(false)}
                                animationType="slide"
                                transparent={true}
                            >
                                <View style={styles.modalContent}>
                                    <Text style={styles.textModal}>Did you mean this event?</Text>
                                    <Text style={styles.textModal1}>{matchedEvent.Details}</Text>
                                    <Image style={styles.img} source={{ uri: matchedEvent.Picture }} />
                                    <View style={styles.rowModal}>
                                        <TouchableOpacity style={styles.btnModal} onPress={() => relatedEvent(matchedEvent.eventNumber)}>
                                            <Text style={styles.textModal1}>Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.btnModal} onPress={() => setModalVisible(false)} >
                                            <Text style={styles.textModal1}>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        ))}
                    </View>
                </View>
            </TouchableWithoutFeedback >
        </GradientBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'center',

    },
    textModal1: {
        fontSize: 20,
        alignSelf: 'center',
    },
    btnModal: {
        marginVertical: 20,
        width: "30%",
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#8FBC8F',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: '#8FBC8F',
        margin: 10
    },
    modalContent: {
        backgroundColor: 'white',
        marginTop: 100,
        marginBottom: 100,
        marginHorizontal: 20,
        padding: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 5,
    },
    btnClose: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    name: {
        position: "absolute",
        fontSize: 20,
        top: 240,
        left: 60,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    titlename: {
        color: '#144800',
        fontSize: 22,
        alignSelf: 'center'
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
        shadowOpacity: 0.9,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '60%',
        backgroundColor: 'white',
        zIndex: 1,
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderbottomEndRadius: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'space-evenly',
    },
    closeButton: {
        right: -80,
        paddingTop: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        height: '100%',
        alignContent: 'center',
    },
    optionSOS: {
        alignContent: 'center',
        height: '15%',
        width: '100%',
        borderColor: '#DCDCDC',
        borderWidth: 0.5,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        marginBottom: 10,

        padding: 5,
        resizeMode: 'contain',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    option: {
        alignContent: 'center',
        height: '18%',
        width: '48%',
        borderColor: '#DCDCDC',
        borderWidth: 0.5,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        marginBottom: 10,
        padding: 5,
        resizeMode: 'contain',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    text: {
        color: '#144800',
        fontSize: 23,
        alignSelf: 'center',
        paddingBottom: 2,
    }, textSOS: {
        fontSize: 23,
        alignSelf: 'center',
        paddingBottom: 2,
        color: '#B00020',

    }, iconSOS: {
        alignSelf: 'center',
        alignItems: 'center',
        size: 30,
        color: '#B00020',

    },
    textModal: {
        fontSize: 25,
        margin: 10
    },
    btnLogOut: {
        left: -80,
        paddingTop: 10,
    },
    textLO: {
        color: '#144800',
        fontSize: 20,
        textDecorationLine: 'underline',

    },
    icon: {
        alignSelf: 'center',
        color: '#144800',
        alignItems: 'center',
        size: 30,
    },
    user: {
        width: 50,
        height: 50,
        borderRadius: 90 / 2,
        resizeMode: 'cover',
        right: -10,
        top: -5,
        alignSelf: 'flex-end'
    },
    img: {
        alignSelf: 'center',
        height: 200,
        borderRadius: 20,
        width: 150,
    },
    rowModal: {
        flexDirection: 'row',
        alignSelf: "center",
        marginTop: 20
    },
});
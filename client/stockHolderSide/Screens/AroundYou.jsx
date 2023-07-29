import React, { useState, useContext } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';
import { LocationContext } from '../Context/LocationContext';

export default function AroundYou(props) {

    const { location } = useContext(LocationContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigation = useNavigation();
    const [stakeholderId, setStakeholderId] = useState()
    const [stakeholder, setstakeholder] = useState(props.route.params.stakeholder);
 
    useFocusEffect(
        React.useCallback(() => {
            setStakeholderId(stakeholder.StakeholderId)
            handleGet();
            return () => {
            };
        }, [isMenuOpen])
    );

    useFocusEffect(React.useCallback(() => {
        const stakeholderIdObj = {
            StakeholderId: stakeholderId,
        };
        fetch(`${cgroup90}/api/stakeholder/details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stakeholderIdObj),
        })
            .then(response => response.json())
            .then(data => {
                setstakeholder(data)
            })
            .catch(error => {
                console.error(error);
            });
    }, [stakeholderId])
);

    const [Events, setEvents] = useState([])


    const handleGet = () => {

        fetch(`${cgroup90}/api/NewEvent`, {

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);

    };

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
    };
    return (
        <View style={styles.container}>
            <View style={styles.hamburger}>
            <TouchableOpacity  onPress={() => { navigation.navigate("Setting", { stakeholder })}}>
                <Image source={{ uri: stakeholder.picture }} style={styles.user} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={styles.titlename}>Hello, {stakeholder.FullName} !</Text>
                </View>
            </View>
            <Navbar stakeholder={stakeholder} />
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
                    {Events.filter(event => event.event_status !== false && event.is_related == null).map(event => (<Marker
                        key={event.EventNumber}
                        coordinate={{
                            latitude: event.Latitude,
                            longitude: event.Longitude,
                        }}
                        title={event.Details}
                        description={event.EventTime}
                        pinColor={typePinColors[event.SerialTypeNumber]}
                        onPress={() => {
                            navigation.navigate('TimeLine', { event, stakeholder });
                        }}
                    />
                    ))}
                </MapView>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'center',
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
        height: '50%',
        backgroundColor: '#F0F8FF',
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
    btnLogOut: {
        left: -80,
        paddingTop: 10,
    },
    textLO: {
        color: '#144800',
        fontSize: 20,
        textDecorationLine: 'underline',
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
    option: {
        alignContent: 'center',
        height: '20%',
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
    },
    icon: {
        alignSelf: 'center',
        color: '#144800',
        alignItems: 'center',
    },
});
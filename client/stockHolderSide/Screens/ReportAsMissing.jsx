import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,  ScrollView, Alert } from 'react-native';
// import { useNavigation } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import { useEffect } from 'react';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

export default function ReportAsMissing(props) {
    const stakeholder = props.route.params.stakeholder;
    const traveler = props.route.params.traveler;
    const userLocation = props.route.params.location
    const navigation = useNavigation();
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [details, setDetails] = useState('');
    const eventStatus = 'true'
    const picture = traveler.Picture;
    const stackholderId = stakeholder.StakeholderId
    const TravelerId = traveler.traveler_id;
    const serialTypeNumber = 1003;
    const [countryNumber, setCountryNumber] = useState('');
    const [areaNumber, setAreaNumber] = useState('');

    useEffect(() => {
        //insert the API Key
        Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
        Geocoder.from(userLocation.Latitude, userLocation.Longitude)
            .then(json => {
                const addressComponents = json.results[0].address_components;
                const countryComponent = addressComponents.find(component => component.types.includes('country'));
                const cityComponent = addressComponents.find(component => component.types.includes('locality'));
                setCountry(countryComponent.long_name);
                setCity(cityComponent.long_name);
                addContry();

            })
            .catch(error => console.warn(error))
    }, []);


    const newEvent = {
        Details: details,
        event_date: new Date().toISOString().slice(0, 10),
        event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        Latitude: userLocation.Latitude,
        Longitude: userLocation.Longitude,
        event_status: eventStatus,
        Picture: picture,
        TravelerId: TravelerId,
        StackholderId: stackholderId,
        serialTypeNumber: serialTypeNumber,
        country_number: countryNumber,
        area_number: areaNumber,
    };
    const countryObj = {
        country_name: country,
    };
    addContry = () => {

        fetch(`${cgroup90}/api/post/country`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(countryObj),
        })
            .then(response => response.json())
            .then(data => {
                setCountryNumber(data)
                addCity();
            })
            .catch(error => {
                console.error(error);
            });
    }

    addCity = () => {
        const areaObj = {
            country_number: countryNumber,
            area_name: city
        }

        fetch(`${cgroup90}/api/post/area`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(areaObj),
        })
            .then(response => response.json())
            .then(data => {
                setAreaNumber(data)
            }
            )
            .catch(error => {
                console.error(error);
            });
         }

    const createEvent = async () => {

        if (newEvent.Details === '') {
            Alert.alert('Please enter details and type');
        }
        else {
            reportAsTrue()
            fetch(`${cgroup90}/api/post/newevent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),

            })
                .then(response => response.json())
                .then(data => {
                    Alert.alert('Missing')
                })
                .catch(error => {
                    Alert.alert('Error', error);
                });
        }
    }
    const travelerIdObj = {
        traveler_id: traveler.traveler_id
    }
    const reportAsTrue = () => {
        fetch(`${cgroup90}/api/post/missingtrue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(travelerIdObj),

        })
            .then(response => response.json())
            .then(data => {
                Alert.alert("Publish")
                navigation.goBack();            
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', error);
            });
    }

    return (
        < GradientBackground>
         <Navbar stakeholder={stakeholder} />
         <BackButton text="Report As Missing" />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.text}>Description:</Text>
                    <TextInput style={styles.input}
                        value={details}
                        onChangeText={(text) => setDetails(text)}
                        placeholder="Write here..."
                        multiline
                        spellCheck="true"
                        onSubmitEditing={() => {
                            TextInput.State.blur(TextInput.State.currentlyFocusedInput())
                        }}>
                    </TextInput>


                    <TouchableOpacity style={styles.btnSave} onPress={createEvent}>
                        <Text style={styles.btnText}>
                            Publish
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView >
        </GradientBackground>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        width: "100%",
        paddingTop: 120
    },
    RoadRanger: {
        alignSelf: 'center',
        resizeMode: 'contain',
        height: 100,
        marginBottom: 20
    },
    text: {
        color: '#144800',
        fontSize: 20,
    },
    btnText: {
        color: '#F8F8FF',
        alignSelf: 'center',
        fontSize: 20,
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
    text1: {
        fontSize: 18,
        alignSelf: 'center',
        color: "#A9A9A9"
    },
    input: {
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
    photo: {
        marginVertical: 20,
        width: "80%",
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderColor: '#144800',
        borderWidth: 2,
        borderRadius: 25,
        backgroundColor: '#144800',
        marginBottom: 50,
        flexDirection: 'row',
    },
    icon: {
        left: 30,
        size: 30,
        marginRight: 50

    },
    placeholderStyle: {
        fontSize: 18,
        color: "#A9A9A9"
    },
    selectedTextStyle: {
        fontSize: 18,
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
});




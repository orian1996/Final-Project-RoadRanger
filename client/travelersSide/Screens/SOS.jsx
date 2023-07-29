import React, { useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import {  useNavigation } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import BackButton from '../Components/BackButton';
import Navbar from '../Components/Navbar';
import { LocationContext } from '../Context/LocationContext'
import { cgroup90 } from '../cgroup90';


export default function SOS(props) {
  const [events, setEvents] = useState([]);
  const traveler = props.route.params.traveler;
  const [eventAddresses, setEventAddresses] = useState([]);
  const navigation = useNavigation();
  const { location, getUserLocation } = useContext(LocationContext)
  Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');

  useEffect(async () => {
    await getUserLocation();
  }, []);

  useEffect(() => {
    const userLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
    fetch(`${cgroup90}/api/post/GetAskForHelpWithin1Km`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLocation),
    })
      .then(response => response.json())
      .then(data => {
        setEvents(data);
     
      }
      )
      .catch(error => {
        console.error(error);
       
      });
  }, [location]);

  useEffect(() => {
    Promise.all(events.map(event => {
      const lat = event.Latitude;
      const lng = event.Longitude;
      return Geocoder.from(lat, lng).then(json => {
        const location = json.results[0].address_components;
        const number = location[0].long_name;
        const street = location[1].long_name;
        const city = location[2].long_name;
        const address = `${street} ${number}, ${city}`;
        return { ...event, address };
      });
    })).then(eventsWithAddress => {
      setEventAddresses(eventsWithAddress);

    });
  }, [events]);


  return (
    <GradientBackground>
      <Navbar traveler={traveler} />
      <BackButton text="SOS" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View>
            {eventAddresses !== undefined && eventAddresses.length > 0 ? (
              eventAddresses.map((event, index) => (
                <TouchableOpacity onPress={() => {
                  Alert.alert(`Starting chat with: ${event.Traveler.first_name} ${event.Traveler.last_name}`)
                  navigation.navigate('Chat', {  loggeduser: traveler ,user: event.Traveler});
                }} >
                  <View style={styles.event} key={event.eventNumber}>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.details}>{event.Details}</Text>
                      <Text >{new Date(event.event_date).toLocaleDateString('en-GB')}</Text>
                      <Text >{event.event_time.slice(0, 5)}</Text>
                      <Text>{event.address}</Text>
                    </View>
                    <Image source={{ uri: event.Picture }} style={styles.img} />
                  <TouchableOpacity>
                    
                  </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No SOS events found.</Text>
            )}
          </View>
        </View>

      </ScrollView>
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    width: "100%",
    height: "100%",
    paddingTop:120,
    marginBottom:30
  },
  scrollContent: {
    paddingBottom: 70, 
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
  }
});
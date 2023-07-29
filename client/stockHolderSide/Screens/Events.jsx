import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import BackButton from '../Components/BackButton';

export default function Events(props) {
  const events = props.route.params.data;
  const stakeholder = props.route.params.stakeholder;
  const [eventAddresses, setEventAddresses] = useState([]);
  const navigation = useNavigation();

Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');

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
      <BackButton text="Events" />
      <ScrollView>
        <View style={styles.container}>
          <View>
            {eventAddresses !== undefined && eventAddresses.length > 0 ? (
              events.map((event, index) => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Event Details', { event: event, stakeholder: stakeholder });
                }} >
                  <View style={styles.event} key={event.eventNumber}>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.details}>{event.Details}</Text>
                      <Text >{new Date(event.EventDate).toLocaleDateString('en-GB')}</Text>
                      <Text >{event.EventTime.slice(0, 5)}</Text>
                      <Text>{event.address}</Text>
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
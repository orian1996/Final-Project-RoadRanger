import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

export default function FollowTraveler(props) {
  const navigation = useNavigation();
  const stakeholder = props.route.params.stakeholder;
  const traveler = props.route.params.traveler;
  const [travelerLocation, setTravelerLocation] = useState([])
  const [lastLocation, setLastLocation] = useState()

  Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
  const mapViewRef = useRef(null);

  const [missing, setMissing] = useState(traveler.missing);

  useEffect(() => {
    getLocationTraveler()
  }, []);

  const getLocationTraveler = () => {
    const objTravelerId = {
      TravelerId: traveler.traveler_id
    }
    fetch(`${cgroup90}/api/locations`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objTravelerId),
    })
      .then(response => response.json())
      .then(data => {
        Promise.all(data.reverse().map(traveler => {
          const lat = traveler.Latitude;
          const lng = traveler.Longitude;
          return Geocoder.from(lat, lng).then(json => {
            const location = json.results[0].address_components;
            const number = location[0].long_name;
            const street = location[1].long_name;
            const city = location[2].long_name;
            const address = `${street} ${number}, ${city}`;
            return { ...traveler, address };
          });
        })).then(travelersWithAddress => {
          const latestLocation = travelersWithAddress[0];
          setLastLocation(latestLocation);
          setTravelerLocation(travelersWithAddress);
        });

      });
  }
  const reportClick = () => {
    setMissing(!missing);
    const newMissing = !missing;
    if (newMissing) {
      navigation.navigate('Report', { stakeholder: stakeholder, traveler: traveler, location: lastLocation })
    } else {
      const travelerIdObj = {
        traveler_id: traveler.traveler_id
      }

      fetch(`${cgroup90}/api/post/missingfalse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(travelerIdObj),
      })
        .then(response => response.json())
        .then(data => {
          Alert.alert("Found")
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', error);
        });
    }

  }

  function formatDateTime(isoDateTime) {
    const date = new Date(isoDateTime);
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = isoDateTime.slice(11, 16);
    return `${formattedTime} ${formattedDate}`
  }


  return (
    <GradientBackground>
      <Navbar stakeholder={stakeholder} />
      <BackButton text="Follow" />
      <View style={styles.container}>
        <View >
          <View style={styles.row}>
            <Image style={styles.img} source={{ uri: traveler.Picture }} />
            <Text style={styles.text}> {traveler.first_name} {traveler.last_name} </Text>
          </View>
        </View>

        {lastLocation && (
          <View>
            <Text style={styles.text}>Last seen at {formatDateTime(lastLocation.DateAndTime)} </Text>
            <Text style={styles.text}>{lastLocation.address}</Text>
          </View> )}
        <TouchableOpacity style={styles.btnSave} onPress={reportClick} >
          <Text style={styles.btnText}  >
            {missing ? 'Report as found' : 'Report as missing'}
          </Text>
        </TouchableOpacity>
        <MapView style={styles.map} region={lastLocation && {
          latitude: lastLocation.Latitude,
          longitude: lastLocation.Longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          {lastLocation && (
            <Marker
              coordinate={{
                latitude: lastLocation.Latitude,
                longitude: lastLocation.Longitude,
              }}
              title={lastLocation.address}
              onPress={() => {
                setLastLocation(lastLocation);
                mapViewRef.current.animateToRegion({
                  latitude: lastLocation.Latitude,
                  longitude: lastLocation.Longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }}
            />
          )}
        </MapView>


        <ScrollView contentContainerStyle={styles.scrollContent}>
          {travelerLocation.length > 0 && (
            travelerLocation.map((traveler, index) => (
              <View key={index} style={styles.commentContainer}>
                <TouchableOpacity onPress={() => setLastLocation(traveler)}>
                  <Text>{formatDateTime(traveler.DateAndTime)}</Text>
                  <Text>{traveler.address}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </GradientBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",
   height:"90%"

  },
  map: {
    marginTop: 15,
    width: 350,
    height: 300,
  },
  scrollContent: {
    marginTop:20,
    paddingBottom: 150,
  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    resizeMode: "contain",
    width:"90%"
  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    top: 0
  },
  btnSave: {
    marginVertical: 20,
    width: "28%",
    paddingVertical: 7,
    paddingHorizontal: 0,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: '#144800',
    position: 'absolute',
    right: 30,
    height: 70,
    justifyContent: 'center',

  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,
  },
});
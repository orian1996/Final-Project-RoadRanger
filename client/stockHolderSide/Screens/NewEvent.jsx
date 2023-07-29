import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,Alert } from 'react-native';
import {  useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import { useEffect } from 'react';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';
import * as Location from 'expo-location';



export default function NewEvent(props) {
  const stakeholder = props.route.params.stakeholder;
  const navigation = useNavigation();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [details, setDetails] = useState('');
  const eventStatus = 'true';
  const [picture, setPicture] = useState('#');
  const stackholderId = stakeholder.StakeholderId
  const TravelerId = null;
  const serialTypeNumber = 1004;
  const [countryNumber, setCountryNumber] = useState('');
  const [areaNumber, setAreaNumber] = useState('');
  const [location, setLocation] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);


  useEffect(() => { 
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLocationFetched(true); 
      getLocation()
    })();
  }, []);
  
  const getLocation=()=>{
    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
    Geocoder.from(location.coords.latitude, location.coords.longitude)
      .then(json => {
        const addressComponents = json.results[0].address_components;
        const countryComponent = addressComponents.find(component => component.types.includes('country'));
        const cityComponent = addressComponents.find(component => component.types.includes('locality'));
        setCountry(countryComponent.long_name);
        setCity(cityComponent.long_name);
       
      })
      .catch(error => console.warn(error))
  }

  useEffect(() => {
    addContry();

  }, [location,locationFetched]);

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
      }
      )
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
    const newEvent = {
      Details: details,
      event_date: new Date().toISOString().slice(0, 10),
      event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      Latitude: location.coords.latitude,
      Longitude: location.coords.longitude,
      event_status: eventStatus,
      Picture: picture,
      TravelerId: TravelerId,
      StackholderId: stackholderId,
      serialTypeNumber: serialTypeNumber,
      country_number: countryNumber,
      area_number: areaNumber,
    };

    if (newEvent.Details === '') {
      Alert.alert('Please enter details and type');
    }
    else {
      fetch(`${cgroup90}/api/post/newevent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),

      })
        .then(response => response.json())
        .then(data => {
          Alert.alert('Publish')
          navigation.goBack();
        })
        .catch(error => {
          Alert.alert('Error', error);
        });
    }
  }

  const OpenCameraE = () => {
    navigation.navigate('CameraE', { idE: `${new Date().getHours()}:${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}` });
    const date = `${new Date().getHours()}_${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`
    setPicture(`${cgroup90}/uploadEventPic/E_${date}.jpg`)
  }
  return (
    < GradientBackground>
       <BackButton text={"New Warning"}/>
      <Navbar stakeholder={stakeholder}/>
      <ScrollView>
        <View style={styles.container}>
       
          <Text style={styles.text}>What Happend:</Text>
          <TextInput style={styles.input}
            value={details}
            onChangeText={(text) => setDetails(text)}
            placeholder="Write here..."
            multiline
            spellCheck="true"
            onSubmitEditing={() => {
              TextInput.State.blur(TextInput.State.currentlyFocusedInput()) }}>
          </TextInput>
       

          <TouchableOpacity style={styles.photo} onPress={OpenCameraE}>
            <Icon name="camera-outline" style={styles.icon} size={30} color={'white'} />
            <Text style={styles.btnText}>
              Add Photo
            </Text>
          </TouchableOpacity>

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
    marginTop: 120,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",
  },

  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100,
    marginBottom: 20,
    shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 4},
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8

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
    borderRadius: 15,
  },
  photo: {
    marginVertical: 20,
    width: "60%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 25,
    backgroundColor: '#144800',
    marginBottom: 50,
    flexDirection: 'row',
    shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 4},
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8

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
    backgroundColor: '#144800',
    shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 4},
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8
  },
});




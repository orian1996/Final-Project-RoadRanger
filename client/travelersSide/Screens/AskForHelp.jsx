import React, { useState,useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import GradientBackground from '../Components/GradientBackground';
import { useEffect } from 'react';
import Geocoder from 'react-native-geocoding';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';
import { LocationContext } from '../Context/LocationContext';

export default function AskForHelp(props) {
  const { location, getUserLocation } = useContext(LocationContext)
  const traveler = props.route.params.traveler;
  const navigation = useNavigation();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const serialType = [
    { label: 'Weather', value: '1' },
    { label: 'Car Accidents', value: '2' },
    { label: 'Road closures', value: '3' },
    { label: 'Natural disasters', value: '4' },
    { label: 'Health emergencies', value: '5' },
    { label: 'Accommodation issues', value: '6' },
    { label: 'Protests', value: '7' },
    { label: 'Strikes', value: '8' },
    { label: 'Security threats', value: '9' },
    { label: 'Animal-related incidents', value: '10' },
    { label: 'Financial issues', value: '11' }
  ]

  useEffect(async () => {
    await getUserLocation();
  }, []);
  
  useEffect(() => {
    //insert the API Key
    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
    Geocoder.from(location.coords.latitude, location.coords.longitude)
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

  const [details, setDetails] = useState('');

  const [picture, setPicture] = useState('#');
  const id = traveler.traveler_id;
  const [serialTypeNumber, setSerialTypeNumber] = useState('');
  const [countryNumber, setCountryNumber] = useState('');
  const [areaNumber, setAreaNumber] = useState('');
  const [selectedSerialType, setSelectedSerialType] = useState(null);

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
        console.log('Error');
      });
  }
  const newSOS = {
    details: details,
    picture: picture,
    traveler_id: id,
    country_number: countryNumber,
    event_date: new Date().toISOString().slice(0, 10),
    event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    area_number: areaNumber,
    serialTypeNumber: serialTypeNumber,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };

  const createSOS = async () => {
    if (newSOS.details === '' || newSOS.serialTypeNumber === '') {
      Alert.alert('Please enter details and type');
    }
    else {
      // Send a POST request to your backend API with the event data
      fetch(`${cgroup90}/api/AskForHelpAndNotify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSOS),
      })
        .then(response => response.json())
        .then(data => {
          navigation.goBack()
          Alert.alert('Publish')
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', 'Failed to sign in. Please try again later.');
        });
    }
  }
  const OpenCameraSOS = () => {
    navigation.navigate('CameraSOS', { idE: `${new Date().getHours()}:${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}` });
    const date = `${new Date().getHours()}_${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`
    setPicture(`${cgroup90}/uploadEventPic/SOS_${date}.jpg`)
  }

  return (
    < GradientBackground>
      <Navbar traveler={traveler} />
      <BackButton text="Ask For Help"/>

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
              //close the keyboard
              TextInput.State.blur(TextInput.State.currentlyFocusedInput())
            }}>
          </TextInput>

          <Text style={styles.text}>Type:</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={serialType}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={"Select type of event"}
            value={selectedSerialType}
            onChange={item => {
              setSerialTypeNumber(item.value)
              setSelectedSerialType(item) // Update the selected item state variable

            }} />
          <TouchableOpacity style={styles.photo} onPress={OpenCameraSOS} >
            <Icon name="camera-outline" style={styles.icon} size={30} color={'white'} />
            <Text style={styles.btnText}>
              Add Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSave} onPress={createSOS}>
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
    marginBottom: 10

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
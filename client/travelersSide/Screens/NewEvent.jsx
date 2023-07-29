import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import {  useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import GradientBackground from '../Components/GradientBackground';
import Geocoder from 'react-native-geocoding';
import { useEffect } from 'react';
import BackButton from '../Components/BackButton';
import stringSimilarity from 'string-similarity';
import { cgroup90 } from '../cgroup90';
import { LocationContext } from '../Context/LocationContext'
import Navbar from '../Components/Navbar';


export default function NewEvent(props) {
  const { location, getUserLocation } = useContext(LocationContext)
  const traveler = props.route.params.traveler;
  const labels = props.route.params.labels;
  const navigation = useNavigation();
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const serialType = [
    //creating type of different eventtypes
    { label: 'Weather', value: '1' },
    { label: 'Car Accidents', value: '1002' },
    { label: 'Road closures', value: '2' },
    { label: 'Natural disasters', value: '3' },
    { label: 'Health emergencies', value: '4' },
    { label: 'Accommodation issues', value: '5' },
    { label: 'Protests', value: '6' },
    { label: 'Strikes', value: '7' },
    { label: 'Security threats', value: '8' },
    { label: 'Animal-related incidents', value: '9' },
    { label: 'Financial issues', value: '10' }
  ]

  const id = traveler.traveler_id;
  const [details, setDetails] = useState('');
  const eventStatus='true';
  const [picture, setPicture] = useState(`${cgroup90}/profilePictures/no-image.png`);
  const stackholderId='null';
  const [serialTypeNumber, setSerialTypeNumber] = useState('');
  const [countryNumber, setCountryNumber] = useState('');
  const [areaNumber, setAreaNumber] = useState('');
  const [selectedSerialType, setSelectedSerialType] = useState(null);

  useEffect(async () => {
    await getUserLocation();
  }, []);

  useEffect(() => {
    //insert the API Key
    console.log("traveler", traveler)
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


  const newEvent = {
    Details: details,
    event_date: new Date().toISOString().slice(0, 10),
    event_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    Latitude: location.coords.latitude,
    Longitude: location.coords.longitude,
    event_status: eventStatus,
    Picture: picture,
    TravelerId: id,
    StackholderId: stackholderId,
    serialTypeNumber: serialTypeNumber,
    country_number: countryNumber,
    area_number: areaNumber,
    labels: JSON.stringify(labels)
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
      })
      .catch(error => {
        console.error(error);
        console.log('Error');
      });
  }
  const translations = []; // Array to store translations
  const createEvent = async () => {
    if (newEvent.Details === '' || newEvent.serialTypeNumber === '') {
      Alert.alert('Please enter details and type');
      return;
    }
    try {
      let res = await fetch(`${cgroup90}/api/post/newevent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      let createdEvent = await res.json();

      //to do if- error ->> return
      let comonventdetailsObj = {
        serialTypeNumber: serialTypeNumber,
        event_status: eventStatus,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      res = await fetch(
        `${cgroup90}/api/post/neweventdistance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comonventdetailsObj),
        }
      );
      let relatedEventsData = await res.json();
      let matchedEvents = []; // Array to store matched events
      for (let i = 0; i < relatedEventsData.length; i++) {
        let event = relatedEventsData[i];
        if (event.Details == newEvent.Details) {
          // If events have identical details, return false
          break;
        }
        if (compareLabels(event, newEvent)) {
          matchedEvents.push(event);
          break;
        }
        let isSimilar = await similarContent(event, newEvent);
        if (isSimilar) {
          console.log(`inside similarContent`, matchedEvents)
          matchedEvents.push(event);
          console.log(`inside similarContent after push`, matchedEvents)

          break;
        }
      }
      if (matchedEvents.length > 0) {
        console.log('Matches found:', matchedEvents);

      } else {
        console.log('No matches found');
      }
      Alert.alert('Publish');
      console.log('Matches found:', matchedEvents);
      navigation.navigate("Around You", { traveler: traveler, matchedEvents: matchedEvents });
    } catch (error) {
      console.error(error);
    }
  };

  const compareLabels = (event1, event2) => {
    console.log(`here1 compareLabelsssssss`, event1, event2)

    if (event1.labels == null || event2.labels == null) {
      // If either event is missing the labels property, return false
      return false;
    }

    if (event1.Details === event2.Details) {
      // If Details are defined and identical, return false
      return false;
    }
    let labels1, labels2;
    try {
     labels1 = JSON.parse(event1.labels).filter(label => label.score > 0.5).map(label => label.description);
     labels2 = JSON.parse(event2.labels).filter(label => label.score > 0.5).map(label => label.description);


    for (const label1 of labels1) {
      for (const label2 of labels2) {
        if (label1 === label2) {
          return true;
        }
      }
    }
  } catch (error) {
    return false;
  }
  };

  const similarContent = async (event1, event2) => {
    // Check if the event times are equal
    if (event1.Details === event2.Details || event1.EventTime.split(':')[0] === event2.event_time.split(':')[0] && event1.EventTime.split(':')[1] === event2.event_time.split(':')[1]) {
      return false;
    }

    // Initialize the translation client
    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCQRIjlNOiWQbf2ldIz6tx4nJfuNhPIycA`;

    // Function to translate text using Google Translate API
    const translateText = async (text, targetLanguage) => {
      const requestBody = {
        q: text,
        target: targetLanguage,
      };

      const response = await fetch(translateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();

      if (

        data &&
        data.data &&
        data.data.translations &&
        data.data.translations.length > 0
      ) {
        console.log('data.data.translations[0].translatedText:', data.data.translations[0].translatedText)
        return data.data.translations[0].translatedText;
      } else {
        throw new Error('Translation not available');
      }
    };

    const translation1 = { value: null };
    const textToTranslate1 = event2.Details;
    const targetLanguage1 = 'en';

    const translation2 = { value: null };
    const textToTranslate2 = event1.Details;
    const targetLanguage2 = 'en';

    try {
      translation1.value = await translateText(textToTranslate1, targetLanguage1);
      translation2.value = await translateText(textToTranslate2, targetLanguage2);
      console.log('translation1.value', translation1.value)
      console.log('translation2.value', translation2.value)

    
      return stringSimilarity.compareTwoStrings(translation1.value, translation2.value) > 0.5;
    } catch (error) {
      return false;
    }
  };

  const OpenCameraE = () => {
    console.log(`here1`)
    navigation.navigate('CameraE', { idE: `${new Date().getHours()}:${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`, location, traveler });
    const date = `${new Date().getHours()}_${new Date().getMinutes()}_${new Date().toISOString().slice(0, 10)}`
    setPicture(`${cgroup90}/uploadEventPic/E_${date}.jpg`)
  }

  return (

    < GradientBackground>
       <BackButton text="New Post"/>
      <Navbar traveler={traveler} />

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
    alignSelf: 'center'

  },

  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9

  },
  text: {
    color: '#144800',
    fontSize: 20,
    left: 15,
  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,

  },

  dropdown: {
    alignSelf: 'center',
    height: 40,
    borderColor: '#8FBC8F',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
    width: "95%",

  },
  input: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    width: "100%",
    fontSize: 20,
    paddingVertical: 70,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 15,

  },
  photo: {
    marginVertical: 20,
    width: "70%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#144800',
    marginBottom: 40,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9

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
    height: 55,
    marginVertical: 20,
    width: "55%",
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#144800',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9
  },
});



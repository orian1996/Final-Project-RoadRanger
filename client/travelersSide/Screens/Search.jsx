import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';
import moment from 'moment';
 
export default function Search(props) {
  const navigation = useNavigation();
 //user-the user who use the app
 const traveler =  props.route.params.traveler;
  useEffect(() => {
    loadData();
  }, []);


  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);

  const serialType = [
    //creating type of different eventtypes
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

  const [events,setEvents]=useState('')
  const [selectedSerialType, setSelectedSerialType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [isCalendarOpenStart, setIsCalendarOpenStart] = useState(false);
  const [isCalendarOpenEnd, setIsCalendarOpenEnd] = useState(false);

  const handleStartDateSelect = (date) => {
    const formattedDate = moment(date).format('DD-MM-YYYY');
    setSelectedStartDate(formattedDate);
    setIsCalendarOpenStart(false);
  }
  const handleEndDateSelect = (date) => {
    const formattedDate = moment(date).format('DD-MM-YYYY');
    setSelectedEndDate(formattedDate);
    setIsCalendarOpenEnd(false);
  }

  const searchObj = [
    { Name: 'countrynumber', Value: selectedCountry },
    { Name: 'AreaNumber', Value: selectedCity },
    { Name: 'startDate', Value: selectedStartDate },
    { Name: 'SerialTypeNumber', Value: selectedSerialType },
    { Name: 'endDate', Value: selectedEndDate },

  ]
  console.log(searchObj)

  const searchEvents = async () => {
    if (selectedCountry === '' && selectedStartDate === '' && selectedSerialType == '') {
      Alert.alert('Please enter for search');
    }
    if (selectedEndDate < selectedStartDate) {
      Alert.alert("End date cannot be earlier than start date");
    }
    else {

      // Send a POST request to backend API with the search data
      fetch(`${cgroup90}/api/post/searchByParameters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchObj),

      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          setEvents(data)
          navigation.navigate("Events",{events: data, traveler: traveler} );
        })
        .catch(error => {
          Alert.alert('No events in this coutry ');
        });
    }
  
  }
  



  //GET the countries and cities from data
 const loadData = () => {
    //GET the countries into array
    fetch(`${cgroup90}/api/getcountries`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const countryData = data.map(country => ({ label: country.country_name, value: country.country_number }))
        setCountry(countryData)
      }
      )
      .catch(error => {
        console.error(error);
        console.log('Error');
      });


    //GET the cities into array
    fetch(`${cgroup90}/api/getareaswithcountry`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const cityData = data.map(city => ({ label: city.area_name, value: city.area_number, countryNumber: city.country_number }))
        setCity(cityData)
      }
      )
      .catch(error => {
        console.error(error);
        console.log('Error');
      });
  }

  //filter the cities based on the selected country
  const filteredCities = city.filter(city => city.countryNumber === selectedCountry);
  return (
    < GradientBackground>
          <Navbar traveler={traveler} />
          <BackButton text="Search"/>
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.text}>Country:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={country}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Select country"}
          value={selectedCountry}
          onChange={item => {
            setSelectedCountry(item.value)
          }} />

        <Text style={styles.text}>City:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={filteredCities}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={"Select country before"}
          value={selectedCity}
          onChange={item => {
            setSelectedCity(item.value)
          }}

        />
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
            setSelectedSerialType(item.value)
          }} />

       <Text style={styles.text}>Start Date:</Text>
        <View>
          <TouchableOpacity onPress={() => setIsCalendarOpenStart(!isCalendarOpenStart)} style={styles.calendar}>
            <Text style={styles.text1}>{selectedStartDate ? selectedStartDate : "Select Start Date"}</Text>
            <Icon style={styles.icon} name="calendar-outline" />
          </TouchableOpacity>
          {isCalendarOpenStart && (
            <View>
              <CalendarPicker onDateChange={handleStartDateSelect} />
            </View>
          )}
        </View>
        <Text style={styles.text}>End Date:</Text>
        <View>
          <TouchableOpacity onPress={() => setIsCalendarOpenEnd(!isCalendarOpenEnd)} style={styles.calendar}>
            <Text style={styles.text1}>{selectedEndDate ? selectedEndDate: "Select End Date "}</Text>
            <Icon style={styles.icon} name="calendar-outline" />
          </TouchableOpacity>
          {isCalendarOpenEnd && (
            <View>
              <CalendarPicker onDateChange={handleEndDateSelect} />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.btnSave} onPress={searchEvents}>
          <Text style={styles.btnText}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </GradientBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop:120,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",
  },
  text: {
    color: '#144800',
    fontSize: 22,
    left:20,
  },
  icon: {
    fontSize: 25
  },
  btnText: {
    alignSelf: 'center',
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,
  },
  calendar: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 25,
    width: '90%',
    height: 50,
    justifyContent: 'space-between'
  },
  dropdown: {
    height: 40,
    alignSelf: 'center',
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
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 18,
    color: "#A9A9A9"
  },
  selectedTextStyle: {
    fontSize: 18,
  },
  btnSave: {
    alignSelf: 'center',
    height:55,
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
	    height: 5},
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9
  },
});
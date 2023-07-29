import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import 'firebase/database';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

export default function Setting(props) {
  const traveler = props.route.params.traveler;
  console.log(traveler);


  useEffect(() => {
    setUserPic(`${cgroup90}/uploadUserPic/U_${email}.jpg`);

  }, [userPic]);
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState(traveler.first_name);
  const [lastName, setLastName] = useState(traveler.last_name);

  const [phone, setPhone] = useState('0' + traveler.phone);
  const gender = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ]

  const insurance = [
    { label: 'PassportCard', value: 'PassportCard' },
    { label: 'Harel', value: 'Harel' },
    { label: 'Other', value: 'Other' },
    { label: 'Menura', value: 'Menura' }
  ]
  const email = traveler.travler_email;
  const password = traveler.password;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(traveler.dateOfBirth);
  const [selectedGender, setSelectedGender] = useState(traveler.gender);
  const [selectedInsurance, setSelectedInsurance] = useState(traveler.insurence_company);
  const [userPic, setUserPic] = useState(traveler.picture)


  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('DD-MM-YYYY');
    setSelectedDate(formattedDate);
    setIsCalendarOpen(false);
  }
  console.log("ttttttt", selectedDate);
  const changeTraveler = {
    travler_email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    notifications: false,
    insurence_company: selectedInsurance,
    location: false,
    save_location: false,
    dateOfBirth: selectedDate,
    gender: selectedGender,
    chat: false,
    picture: userPic
  };
  const saveChanges = async () => {
    if (phone.length != 10) {
      // Phone is too short
      Alert.alert('Phone must be 10 numbers.');
      return;
    }
    fetch(`${cgroup90}/api/put/update?email=${traveler.travler_email}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changeTraveler),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Traveler updated successfully.
        Alert.alert('Traveler updated successfully')
        navigation.goBack(); // Navigate back to the "Around You" screen
      })
      .catch((error) => {
        console.error(error);
      });
  }
  console.log(email)
  const openCamera = () => {
    navigation.navigate('Camera', { email });
    handleSavePhoto();
  }
  const handleSavePhoto = () => {
    setUserPic(`${cgroup90}/uploadUserPic/U_${email}.jpg`);
  }

  return (
    < GradientBackground>
      <Navbar traveler={traveler} />
      <BackButton text="Setting" />
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity onPress={openCamera}>
            <Image source={{ uri: traveler.Picture }} style={styles.user} />
          </TouchableOpacity >
          <Text style={styles.text}>First Name:</Text>
          <TextInput style={styles.input}
            onChangeText={(text) => setFirstName(text)}
            placeholder={traveler.first_name}>
          </TextInput>
          <Text style={styles.text}>Last Name:</Text>
          <TextInput style={styles.input}
            onChangeText={(text) => setLastName(text)}
            placeholder={traveler.last_name}>
          </TextInput>
          <Text style={styles.text}>Phone:</Text>
          <TextInput style={styles.input}
            placeholder={phone}
            keyboardType='numeric'
            onChangeText={(text) => setPhone(text)}
          >
          </TextInput>
          <Text style={styles.text}>Gender:</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={gender}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={selectedGender}
            value={traveler.gender}
            onChange={item => {
              setSelectedGender(item.value)
            }} />
          <Text style={styles.text}>Insurance Company:</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={insurance}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={traveler.insurence_company}
            value={traveler.insurance_company}
            onChange={item => {
              setSelectedInsurance(item.value)
            }}

          />
          <Text style={styles.text}>Date of Birth:</Text>
          <View>
            <TouchableOpacity onPress={() => setIsCalendarOpen(!isCalendarOpen)} style={styles.calendar}>
              <Text style={styles.text1}>{moment(selectedDate).format('MM-DD-YYYY')}</Text>
              <Icon style={styles.icon} name="calendar-outline" />
            </TouchableOpacity>
            {isCalendarOpen && (
              <View>
                <CalendarPicker onDateChange={handleDateSelect} />
              </View>
            )}
          </View>
        
          <TouchableOpacity style={styles.btnSave} onPress={saveChanges}>
            <Text style={styles.btnText}>
              Save Changes
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
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",
    paddingBottom: 100,
  },

  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100
  },
  text: {
    color: '#144800',
    fontSize: 20,

  },
  icon: {
    fontSize: 25
  },
  btnSignUp: {
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
  user: {
    alignSelf: 'center',
    resizeMode: 'cover',
    height: 150,
    borderRadius: 75,
    width: 150,
    marginBottom: 25,
  },
  btnText: {
    color: '#F8F8FF',
    alignSelf: 'center',
    fontSize: 20,
  },
  calendar: {
    flexDirection: 'row',
    marginVertical: 10,
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 20,
    width: '90%',
    height: 50,
    justifyContent: 'space-between'
  },
  dropdown: {
    height: 40,
    borderColor: '#8FBC8F',
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 18,
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
  text2: {
    fontSize: 18,
    alignSelf: 'center',
  },
  input: {
    flexDirection: 'row',
    marginVertical: 5,
    width: "90%",
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#144800',
    borderWidth: 1,
    borderRadius: 20,
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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 },
  btnSave: {
    alignSelf: 'center',
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
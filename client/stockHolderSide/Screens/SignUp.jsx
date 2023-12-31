import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Switch, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import RoadRanger from '../assets/RoadRanger.png';
import { Dropdown } from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import GradientBackground from '../Components/GradientBackground';
import { cgroup90 } from '../cgroup90';
import BackButton from '../Components/BackButton';

export default function SignUp({ route }) {
  const defaultPic = `${cgroup90}/profilePictures/id1.png`;
  const [newProfilePic, setNewProfilePic] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.image) {
        setNewProfilePic(route.params.image.uri);
        console.log(route.params.image.uri);
      }
    }, [route.params?.image])
  );

  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const gender = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },]

  const insurance = [
    { label: 'PassportCard', value: 'PassportCard' },
    { label: 'Harel', value: 'Harel' },
    { label: 'Other', value: 'Other' },
  ]
  const [value, setValue] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEnabledLocation, setIsEnabledLocation] = useState(false);
  const [isEnabledChatMode, setIsEnabledChatMode] = useState(false);
  const [isEnabledNotification, setIsEnabledNotification] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [genderSelection, setGenderSelection] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [insuranceSelection, setInsuranceSelection] = useState(null);
  // const toggleSwitchLocation = () => setIsEnabledLocation(previousState => !previousState);
  // const toggleSwitchChatMode = () => setIsEnabledChatMode(previousState => !previousState);
  // const toggleNotification = () => setIsEnabledNotification(previousState => !previousState);

  const handleDateSelect = (date) => {
    const formattedDate = moment(date).format('DD/MM/YY');
    setSelectedDate(formattedDate);
    setIsCalendarOpen(false);
  }
  const newTraveler = {
    first_name: firstName,
    last_name: lastName,
    travler_email: email,
    phone: phone,
    notifications: isEnabledNotification,
    insurence_company: selectedInsurance,
    location: isEnabledLocation,
    save_location: isEnabledLocation,
    dateOfBirth: selectedDate,
    gender: selectedGender,
    password: password,
    chat: isEnabledChatMode,
    Picture: newProfilePic ?? defaultPic
  };
  const handleSignUp = async () => {
    fetch(`${cgroup90}/api/post/SignUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTraveler),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response data as needed
        console.log(newTraveler)
        console.log(data);
        navigation.navigate("Forgot password")
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Failed to sign in. Please try again later.');
      });
  };


  const openCamera = () => {
    navigation.navigate('Camera');
  }

  return (


    < GradientBackground>
      <BackButton text={"Sign Up"} />
      <View style={styles.container}>
        <ScrollView>
          <Image source={RoadRanger} style={styles.RoadRanger} />
          <TouchableOpacity onPress={openCamera}>
            {newProfilePic ? (
              <Image source={{ uri: newProfilePic }} style={styles.user} />
            ) : (
              <Image source={{ uri: defaultPic }} style={styles.user} />
            )}
          </TouchableOpacity >
          <Text style={styles.text}>First Name:</Text>
          <TextInput style={styles.input}
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            placeholder="First Name">
          </TextInput>
          <Text style={styles.text}>Last Name:</Text>
          <TextInput style={styles.input}
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            placeholder="Last Name">
          </TextInput>
          <Text style={styles.text}>Email:</Text>
          <TextInput style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="User Email">
          </TextInput>
          <Text style={styles.text}>Password:</Text>
          <TextInput style={styles.input}
            placeholder="*******"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}>
          </TextInput>
          <Text style={styles.text}>Phone:</Text>
          <TextInput style={styles.input}
            placeholder="Phone"
            value={phone}
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
            placeholder={"Select a gender"}
            value={genderSelection}
            onChange={item => {
              setSelectedGender(item.label)
              setGenderSelection(item)
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
            placeholder={"select an Insurance Company"}
            value={insuranceSelection}
            onChange={item => {
              setSelectedInsurance(item.value)
              setInsuranceSelection(item)
            }}

          />
          <Text style={styles.text}>Date of Birth:</Text>
          <View>
            <TouchableOpacity onPress={() => setIsCalendarOpen(!isCalendarOpen)} style={styles.calendar}>
              <Text style={styles.text1}>{selectedDate ? selectedDate.toString() : "Select you'r Date of Birth"}</Text>
              <Icon style={styles.icon} name="calendar-outline" />
            </TouchableOpacity>
            {isCalendarOpen && (
              <View>
                <CalendarPicker onDateChange={handleDateSelect} />
              </View>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.text2}>Location Mode</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#8FBC8F" }}
              thumbColor={isEnabledLocation ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchLocation}
              value={isEnabledLocation}
            />
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.text2}>Notification</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#8FBC8F" }}
              thumbColor={isEnabledNotification ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotification}
              value={isEnabledNotification}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.text2}>Chat Mode</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#8FBC8F" }}
              thumbColor={isEnabledChatMode ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchChatMode}
              value={isEnabledChatMode}
            />
          </View> */}
          <TouchableOpacity style={styles.btnSave} onPress={handleSignUp}>
            <Text style={styles.btnText}>
              Save
            </Text>
          </TouchableOpacity>
        </ScrollView >
      </View>
    </GradientBackground>

  )
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    width: "100%",
    paddingTop: 120
  },

  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 50

  },
  user: {
    alignSelf: 'center',
    resizeMode: 'cover',
    height: 150,
    borderRadius: 75,
    width: 150,
    marginBottom: 25,

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
    borderRadius: 25,
    width: '90%',
    height: 50,
    justifyContent: 'space-between'

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
    borderRadius: 25,

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
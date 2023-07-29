import React, { useEffect, useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView,Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import BackButton from '../Components/BackButton';
import GradientBackground from '../Components/GradientBackground';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

export default function Setting(props) {
  const stakeholder = props.route.params.stakeholder;
  const navigation = useNavigation();
  const [full_name, setFullName] = useState(stakeholder.FullName);
  const satkeholder_name= stakeholder.StakeholderName;
  const stakeholder_email=stakeholder.StakeholderEmail;
  const [password, setPassword] = useState(stakeholder.Password);
  const [phone, setPhone] = useState(stakeholder.Phone);
  const [userPic, setUserPic] = useState(stakeholder.picture)
  const [token, setToken] = useState(null);
  const selectedStakeholderType=stakeholder.StakeholderType;

useEffect(() => {
  const fetchUserPic = async () => {
    try {
      const response = await fetch(`${cgroup90}/uploadUserPic/U_${stakeholder_email}.jpg`);
      if (response.ok) {
        setUserPic(`${cgroup90}/uploadUserPic/U_${stakeholder_email}.jpg`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  fetchUserPic();
}, [stakeholder_email, stakeholder.Picture]);

  const changeStakeholder = {
    FullName: full_name,
    StakeholderName: satkeholder_name,
    StakeholderEmail: stakeholder_email,
    Phone: phone,
    Notifications: false,
    stakeholderType: selectedStakeholderType,
    password: password,
    chat: false,
    picture: userPic,
    token: token
  };

  const saveChanges = async () => {
    fetch(`${cgroup90}/api/put/stakeholder/update?email=${stakeholder.StakeholderEmail}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changeStakeholder),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert('Stakeholder updated successfully')
        navigation.goBack(); // Navigate back to the "Around You" screen
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const openCamera = () => {
    navigation.navigate('Camera', stakeholder_email);
    handleSavePhoto();
  }
  const handleSavePhoto = () => {
    setUserPic(`${cgroup90}/uploadUserPic/U_${stakeholder.StakeholderEmail}.jpg`);
  }
  return (
    < GradientBackground>
      <Navbar stakeholder={stakeholder} />
      <BackButton text="Setting" />
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity onPress={openCamera}>
            <Image source={{ uri: stakeholder.picture }} style={styles.user} />
          </TouchableOpacity >

          <Text style={styles.text}>Full Name:</Text>
          <TextInput style={styles.input}
            onChangeText={(text) => setFullName(text)}
            placeholder={stakeholder.FullName}>
          </TextInput>

          <Text style={styles.text}>Phone:</Text>
          <TextInput style={styles.input}
            placeholder={'0' + stakeholder.Phone.toString()}
            value={phone}
            keyboardType='numeric'
            onChangeText={(text) => setPhone(text)}
          >
          </TextInput>

          <Text style={styles.text}>Password:</Text>
          <TextInput style={styles.input}
            placeholder={stakeholder.Password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}>
          </TextInput>

          <TouchableOpacity style={styles.btnSave} onPress={saveChanges}>
            <Text style={styles.btnText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 20,
    width: "100%",
    paddingTop: 100,
    paddingBottom: 300,

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
    borderRadius: 15,
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
    borderRadius: 15,
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
    borderRadius: 15,

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
    backgroundColor: '#144800',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
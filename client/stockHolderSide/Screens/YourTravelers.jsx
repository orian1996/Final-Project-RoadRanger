import React, { useEffect, useState } from 'react';
import { View, Text,  StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import Geocoder from 'react-native-geocoding';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

export default function YourTravelers(props) {
  const navigation = useNavigation();
  Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');

  const stakeholder = props.route.params.stakeholder;
  const [myTravelers, setMyTravelers] = useState([])

  useEffect(() => {
    if (stakeholder.StakeholderType == 'Insurance Company') {
      stackholderTypeInsurence()
    }
    else {
      stackholderType()
    }
  }, []);

  const stackholderType = () => {
    fetch(`${cgroup90}/api/lastlocation`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then(data => {
        Promise.all(data.map(traveler => {
          const lat = traveler.last_location.Latitude;
          const lng = traveler.last_location.Longitude;
          return Geocoder.from(lat, lng).then(json => {
            const location = json.results[0].address_components;
            const number = location[0].long_name;
            const street = location[1].long_name;
            const city = location[2].long_name;
            const address = `${street} ${number}, ${city}`;
            return { ...traveler, address };
          });
        })).then(travelersWithAddress => {
          setMyTravelers(travelersWithAddress);
        });
      });
  }

  const stackholderTypeInsurence = () => {
    const objInsuranceCompany = {
      insurence_company: stakeholder.StakeholderName
    }
    fetch(`${cgroup90}/api/post/GetTravelersByInsuranceCompanyNLL`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objInsuranceCompany),
    })
      .then(response => response.json())
      .then(data => {
        Promise.all(data.map(traveler => {
          const lat = traveler.last_location.Latitude;
          const lng = traveler.last_location.Longitude;
          return Geocoder.from(lat, lng).then(json => {
            const location = json.results[0].address_components;
            const number = location[0].long_name;
            const street = location[1].long_name;
            const city = location[2].long_name;
            const address = `${street} ${number}, ${city}`;
            return { ...traveler, address };
          }).catch(error => {
            console.error(error);
          });
        })).then(travelersWithAddress => {
          setMyTravelers(travelersWithAddress);

        }).catch(error => {
          console.error(error);
        });
      });
  }



  function formatDateTime(isoDateTime) {
    const date = new Date(isoDateTime);
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = isoDateTime.slice(11, 16);
    return `${formattedTime} ${formattedDate}`;
  }
  return (
    < GradientBackground>
      <BackButton text="My Travelers" />
      <Navbar stakeholder={stakeholder} />
      <ScrollView>

        <View style={styles.container}>
          {myTravelers.length > 0 && (
            myTravelers.map((traveler, index) => (
              <View key={index} style={styles.commentContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate("Follow", { traveler, stakeholder }) }}>
                  <View style={styles.event}>
                    <View style={styles.row}>
                      <Image style={styles.img} source={{ uri: traveler.Picture }} />
                      <Text style={styles.text}> {traveler.first_name} {traveler.last_name} </Text>
                    </View>
                  </View>
                  <Text>{traveler.address}</Text>
                  <Text>{formatDateTime(traveler.last_location.DateAndTime)}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    marginBottom: 100
  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
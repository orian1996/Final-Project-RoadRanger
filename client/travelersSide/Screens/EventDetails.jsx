import { Dimensions, Keyboard, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, Alert, Button } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackButton from '../Components/BackButton';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import { cgroup90 } from '../cgroup90';
import Navbar from '../Components/Navbar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EventDetails(props) {
  const event = props.route.params.event;
  //user-the user who use the app
  const user = props.route.params.traveler;
  //traveler-the user who post event
  const [traveler, setTraveler] = useState('');
  const [addressComponents, setAddressComponents] = useState('')
  const [comments, setComments] = useState('')
  const [details, setDetails] = useState('');
  const stackholderId='null'
  const [newCommentPublished, setNewCommentPublished] = useState(false); // <-- add new state variable
  const [deletedComment, setDeletedComment] = useState(false)
  const [userLocation, setUserLocation] = useState(null); // Add a new state variable for user location
  const [trueOrFalse, setTrueOrFalse] = useState('');

  const fetchTravelerDetails = async () => {
    const travelerobj = {
      traveler_Id: event.TravelerId
    };
    try {
      const response = await fetch(`${cgroup90}/api/traveler/details`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(travelerobj),
      });

      const data = await response.json();
      setTraveler(data);
      fetchNumberEvent();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNumberEvent = async () => {
    const eventNumberObj = {
      eventNumber: event.eventNumber
    };

    try {
      const response = await fetch(`${cgroup90}/api/events/comments`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventNumberObj),
      });

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.log('Error');
    }


  };
  const getUserLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      setUserLocation(coords); // Save user coordinates in state
    } catch (error) {
      console.error(error);
      
    }
  };
  useEffect(() => {
    const checkTravelersLocation = async () => {
      if (!userLocation) {
        return;
      }
      console.log("", event);

      const eventIdObj = {
        eventNumber: event.eventNumber
      };

      const { latitude, longitude } = userLocation; // Destructure latitude and longitude

      try {
        const response = await fetch(`${cgroup90}/api/post/checkdistance?longtiude=${longitude.toString().slice(0, 9)}&latitude=${latitude.toString().slice(0, 9)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventIdObj),
        });

        const data = await response.json();
        setTrueOrFalse(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', error);
      }
    };

    const timeoutId = setTimeout(() => {
      checkTravelersLocation();
    }, 1000); // Adjust the delay as needed

    checkTravelersLocation(); // Call it immediately to log "here2" and "here7"

    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
  }, [userLocation, event]);



  useEffect(() => {
    getUserLocation();
    fetchTravelerDetails();
    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
    Geocoder.from(`${event.Latitude},${event.Longitude}`)
      .then((json) => {
        const location = json.results[0].address_components;
        console.log(location)
        const number = json.results[0].address_components[0].long_name;
        const street = json.results[0].address_components[1].long_name;
        const city = json.results[0].address_components[2].long_name;
        setAddressComponents(`${street} ${number}, ${city}`);
      }
      )
      .catch(error => {
        console.error(error);
      });

  }, [newCommentPublished, deletedComment,]);

  const newComment = {
    eventNumber: event.eventNumber,
    Details: details,
    comment_date: new Date().toISOString().slice(0, 10),
    comment_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    TravelerId: user.traveler_id,
    StackholderId: stackholderId,

  };

  const navigation = useNavigation();


  const createComment = async () => {

    if (newComment.Details == "") {
      Alert.alert('Please enter details ');
    }
    else {
      // Send a POST request to your backend API with the comment data
      fetch(`${cgroup90}/api/newcomment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data as needed
          setNewCommentPublished(true)
          Alert.alert('Publish')
          setNewCommentPublished(false)
          setDetails('');
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error', error);
        });
    }
  }


  const renderDeleteLogo = () => {
    if (comments.length === 0 && event.TravelerId == user.traveler_id) {
      return (
        <TouchableOpacity style={styles.deleteIcon} onPress={handleDeleteEvent}>
          <Icon name="trash-outline" size={25} style={styles.icon} />
        </TouchableOpacity>
      );
    }
  }
  const handleDeleteEvent = () => {
    const eventObj = {
      eventNumber: event.eventNumber,
      travelerId: user.traveler_id
    };
    console.log(eventObj)

    fetch(`${cgroup90}/api/deleteevent`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventObj)
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert("Deleted");
        navigation.goBack(); // Navigate back to the "Around You" screen
      })
      .catch(error => {
        console.error(error);
      });
  }
  const deleteComment = (CommentNumber) => {
    const commentObj = {
      commentNumber: CommentNumber
    };
    console.log(commentObj)

    fetch(`${cgroup90}/api/deletecomment`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentObj)
    })
      .then(response => response.json())
      .then(data => {
        setDeletedComment(true)
        Alert.alert("Deleted");
        setDeletedComment(false)
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleButtonPress = (approved) => {
    const ansObj = {
      Approved: approved ? 1 : 0,
      Not_approved: approved ? 0 : 1
    };

    let relatedEvent;

    if (event.is_related === null) {
      relatedEvent = event.eventNumber;
    } else {
      relatedEvent = event.is_related;
    }

    console.log(ansObj);

    fetch(`${cgroup90}/api/put/eventapproval/${relatedEvent}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ansObj),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Event approval request succeeded");
          // Handle the successful approval request
          Alert.alert('Thank you! ');
          setTrueOrFalse(false)
        } else {
          console.log("Event approval request failed");
          // Handle the failed approval request
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle the error if needed
      });
  };

  const handleButtonPressIDK = () => {
    Alert.alert('Thank you! ');
    setTrueOrFalse(false)
  }
  console.log("eeeee", event);
  return (
    <GradientBackground>
      <Navbar traveler={traveler} />

      <BackButton text="Event Details" />

      {trueOrFalse === true && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Is it true?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnModal} onPress={() => handleButtonPress(true)}>
              <Text style={styles.textModal1}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnModal} onPress={() => handleButtonPress(false)}>
              <Text style={styles.textModal1}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnModal} onPress={() => handleButtonPressIDK()}>
              <Text style={styles.textModal1}>IDK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >


        <View style={styles.eventContainer}>

          <View style={styles.event}>
            <View style={styles.row}>
              <Image style={styles.img} source={{ uri: traveler.Picture }} />
              <Text style={styles.text}>{traveler.first_name} {traveler.last_name}</Text>
            </View>
            <View>
              <Text style={styles.textdateTime}>{event.EventTime.slice(0, 5)} {new Date(event.EventDate).toLocaleDateString('en-GB')}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.detailsText}>{event.Details}</Text>
            {renderDeleteLogo()}
          </View>
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
            <Text style={styles.locationText}>{addressComponents}</Text>
          </View>
          {event.Picture != '#' && (
            <View style={styles.pictureContainer}>
              <Image source={{ uri: event.Picture }} style={styles.picture} resizeMode="cover" />
            </View>
          )}


          <ScrollView>
            {comments.length > 0 && (
              comments.map((comment, index) => (
                <View key={index} style={styles.commentContainer}>
                  <View style={styles.event}>
                    <View style={styles.row}>
                      {comment.picture ? (
                        <Image style={styles.img} source={{ uri: comment.picture }} />
                      ) : (
                        <Image style={styles.img} source={{ uri: comment.shpicture }} />
                      )}
                      <Text style={styles.text}>  {comment.TravelerName ? comment.TravelerName : comment.StakeholderName} </Text>
                    </View>
                    <View>
                      <Text style={styles.textdateTime}>{comment.CommentTime.slice(0, 5)} {new Date(comment.CommentDate).toLocaleDateString('en-GB')} </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.detailsTextComment}> {comment.Details}  </Text>
                    {comment.TravelerId == user.traveler_id && (
                      <TouchableOpacity style={styles.deleteIcon} onPress={() => deleteComment(comment.CommentNumber)}>
                        <Icon name="trash-outline" size={20} color={'black'} />
                      </TouchableOpacity>
                    )}
                  </View>

                </View>
              ))
            )}
          </ScrollView>
        </View>
        <ScrollView>
          <View style={styles.addComment}>
            <View style={styles.event}>
              <View style={styles.row}>
                <Image style={styles.img} source={{ uri: user.Picture }} />
                <Text style={styles.text}>{user.first_name} {user.last_name}</Text>
              </View>
              <TouchableOpacity onPress={createComment}>
                <Icon name="arrow-forward-circle-outline" size={25} style={styles.icon} />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.input}
                placeholder="Add Comment..."
                value={details}
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setDetails(text)}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
    marginTop: 120,
    marginBottom: 30
  },
  pictureContainer: {
    height: height * 0.2, // adjust this value as needed
    width: width * 0.9,
    heigh: 150,
    width: 150,
    paddingTop: 20,
    paddingBottom: 30
  },
  picture: {
    flex: 1,
    width: '100%',
    height: '10%',
    padding: 5,
    borderRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 10,
  },
  event: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 15,
    padding: 10,
    height: '75%',
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentContainer: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    resizeMode: "contain",
  },
  locationText: {
    fontSize: 15,
    fontWeight: 'bold',
    top: 5
  },
  detailsText: {
    alignItems: 'center',
    fontSize: 20,
    left: 10,
    marginTop: 10
  },
  addComment: {
    borderColor: '#DCDCDC',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    margin: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
  dateTimeContainer: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  textdateTime: {
    fontSize: 16,
    marginVertical: 5,
    fontSize: 10,
    right: 10,
    textAlign: 'right'
  },
  detailsTextComment: {
    fontSize: 15,
    paddingTop: 5
  },
  input: {
    left: 50,
    paddingBottom: 10,
    width: '75%',
  },
  icon: {
    top: 20
  },
  inputContainer: {
    flexGrow: 1,
  },
  keyboard: {
    flex: 1,
  },
  deleteIcon: {
    flexDirection: 'row-reverse'
  },
  headerContainer: {
    top: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 5,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }, btnModal: {
    marginVertical: 10,
    width: "25%",
    alignSelf: 'center',
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderColor: '#8FBC8F',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: '#8FBC8F',
  }, textModal1: {
    fontSize: 15,
    alignSelf: 'center',
  },
});
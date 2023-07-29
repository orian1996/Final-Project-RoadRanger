import { Dimensions, Keyboard, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";
import Geocoder from 'react-native-geocoding';
import { KeyboardAvoidingView, Platform } from 'react-native';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function EventDetails(props) {
  const event = props.route.params.event;
  const stakeholder = props.route.params.stakeholder;
  const [deletedComment, setDeletedComment] = useState(false)
  const [newCommentPublished, setNewCommentPublished] = useState(false); 

  const travelerId = "null";
  const [traveler, setTraveler] = useState('');
  const [addressComponents, setAddressComponents] = useState('')
  const [comments, setComments] = useState('')
  const [details, setDetails] = useState('');

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
      console.error(error);
    }


  };
  const newComment = {
    eventNumber: event.eventNumber,
    Details: details,
    comment_date: new Date().toISOString().slice(0, 10),
    comment_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    TravelerId: travelerId,
    StackholderId: stakeholder.StakeholderId,

  };

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
          setNewCommentPublished(true)
          Alert.alert('Publish')
          setNewCommentPublished(false)
          setDetails('');
        })
        .catch(error => {
          Alert.alert('Error', error);
        });
    }
  }
  useEffect(() => {
    fetchTravelerDetails();
    Geocoder.init('AIzaSyAxlmrZ0_Ex8L2b_DYtY7e1zWOFmkfZKNs');
    Geocoder.from(`${event.Latitude},${event.Longitude}`)
      .then((json) => {
        const location = json.results[0].address_components;
        const number = json.results[0].address_components[0].long_name;
        const street = json.results[0].address_components[1].long_name;
        const city = json.results[0].address_components[2].long_name;
        setAddressComponents(`${street} ${number}, ${city}`);
      }
      )
      .catch(error => {
        console.warn('Geocoder.from failed');
      });
  }, [newCommentPublished, deletedComment]);

  const deleteComment = (CommentNumber) => {
    const commentObj = {
      commentNumber: CommentNumber
    };
  

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
        Alert.alert('Deleted');
        setDeletedComment(false)
      })
      .catch(error => {
        console.error(error);
      });
  }

  const onScreenTapped = () => {
    Keyboard.dismiss();
  };

  return (
    <GradientBackground>
      <BackButton text="Event Details" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={onScreenTapped}>
          <View style={styles.eventContainer } >
            <View >
              <View style={styles.event}>
                <View style={styles.row}>
                  <Image style={styles.img} source={{ uri: stakeholder.picture }} />
                  <Text style={styles.text}>{stakeholder.FullName} </Text>
                </View>
                <View>
                  <Text style={styles.textdateTime}>{event.EventTime} {new Date(event.EventDate).toLocaleDateString('en-US')}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.detailsText}>{event.Details}</Text>
              </View>
            </View>

            <View style={styles.locationContainer}>
              <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
              <Text style={styles.locationText}>{addressComponents}</Text>
            </View>

            {event.Picture != '#' && (
              <View style={styles.pictureContainer}>
                <Image source={{ uri: event.Picture }} style={styles.picture} resizeMode="contain" />
              </View>
            )}
            <ScrollView>
              {comments && comments.length > 0 && (
                comments.map((comment, index) => (
                  <View key={index} style={styles.commentContainer}>
                    <View style={styles.event}>
                      <View style={styles.row}>
                        {comment.picture ? (
                          <Image style={styles.img} source={{ uri: comment.picture }} />
                        ) : (
                          <Image style={styles.img} source={{ uri: comment.shpicture }} />
                        )}
                        <Text style={styles.text}>{comment.TravelerName ? comment.TravelerName : comment.StakeholderName} </Text>
                      </View>
                      <View>
                        <Text style={styles.textdateTime}>{comment.CommentTime.slice(0, 5)} {new Date(comment.CommentDate).toLocaleDateString('en-GB')}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.detailsTextComment}> {comment.Details}  </Text>
                      {comment.StackholderId == stakeholder.StakeholderId && (
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
          <View style={styles.addComment}>
            <View style={styles.event}>
              <View style={styles.row}>
                <Image style={styles.img} source={{ uri: stakeholder.picture }} />
                <Text style={styles.text}>{stakeholder.FullName}</Text>
              </View>
              <TouchableOpacity onPress={createComment}>
                <Icon name="arrow-forward-circle-outline" size={25} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TextInput style={styles.input}
                placeholder="Add Comment..."
                value={details}
                multiline={true}
                numberOfLines={4}
                editable={true}
                onChangeText={(text) => setDetails(text)}>
              </TextInput>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GradientBackground >
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
    marginTop: 120,
    marginBottom: 30

  },


  pictureContainer: {
    height: height * 0.2, 
    width: width * 0.9,
    heigh: 150,
    width: 150,
    paddingTop: 20,
    paddingBottom: 30,


  },
  picture: {
    flex: 1,
    width: '100%',
    height: '10%',
    padding: 5,
    borderRadius: 20,
    // transform: [{ scaleX: -1 }]
    // scaleX:-1
    // position: 'absolute'
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
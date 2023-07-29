import { Dimensions,Keyboard, StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'
import GradientBackground from '../Components/GradientBackground';
import Icon from "react-native-vector-icons/Ionicons";
 import { KeyboardAvoidingView, Platform } from 'react-native';
import BackButton from '../Components/BackButton';
import { cgroup90 } from '../cgroup90';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function MissingDetails(props) {
  const event = props.route.params.event;
  const stakeholder = props.route.params.stakeholder;

  const [comments, setComments] = useState('')
  const [details, setDetails] = useState('');
  const stackholderId= 'null';
  const [newCommentPublished, setNewCommentPublished] = useState(false); // <-- add new state variable
  const [deletedComment, setDeletedComment] = useState(false)
  


useEffect(() => {
    fetchNumberEvent()
},[deletedComment,newCommentPublished])

  const fetchNumberEvent = async () => {
    const eventNumberObj = {
      eventNumber: event.Event.eventNumber
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
    eventNumber: event.Event.eventNumber,
    Details: details,
    comment_date: new Date().toISOString().slice(0, 10),
    comment_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    TravelerId: 'null',
    StackholderId:  stakeholder.StakeholderId,

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
  const onScreenTapped = () => {
    Keyboard.dismiss();
  }; 

  const renderDeleteLogo = () => {
    if (comments.length === 0 && event.TravelerId == event.Traveler.traveler_id) {
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
      travelerId: traveler.traveler_id
    };

    fetch(`${cgroup90}/api/deleteevent`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventObj)
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  }
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
        Alert.alert('Deleted')
        setDeletedComment(false)
      })
      .catch(error => {
        console.error(error);
      });
  }


  return (
    <GradientBackground>
      <BackButton text="Event Details" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={onScreenTapped}>

        <View style={styles.eventContainer}>
          <View style={styles.event}>      
            <Text style={styles.detailsText}>{event.Event.Details}</Text>        
          </View>
          <View>
          <Text style={styles.detailsText}>Traveler name: {event.Traveler.first_name} {event.Traveler.last_name}</Text>
          <Text style={styles.detailsText}>Last seen: {event.Event.EventTime.slice(0, 5)} {new Date(event.Event.EventDate).toLocaleDateString('en-GB')}</Text>
            {renderDeleteLogo()}
          </View>
          <View style={styles.locationContainer}>
            <Icon name="location-outline" size={30} color={'black'} style={styles.locationIcon} />
            <Text style={styles.locationText}>{event.address}</Text>
          </View>
            <View style={styles.pictureContainer}>
              <Image source={{ uri: event.Traveler.Picture }} style={styles.picture} resizeMode="cover" />
            </View>
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
        <ScrollView>
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
        </TouchableOpacity>
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
    height: height * 0.2, 
    width: width * 0.9,
     heigh:150,
     width:150,
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
    fontSize: 18,
    left: 10,
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
  },
   textModal1: {
    fontSize: 15,
    alignSelf: 'center',
  },
});
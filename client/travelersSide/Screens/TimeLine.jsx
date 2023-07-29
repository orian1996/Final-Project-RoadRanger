import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Timeline from 'react-native-timeline-flatlist';
import GradientBackground from '../Components/GradientBackground';
import BackButton from '../Components/BackButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { cgroup90 } from '../cgroup90';


export default function TimeLine(props) {
  const event = props.route.params.event;
  const traveler = props.route.params.traveler;
  const [events, setEvents] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const eventNumberObj = {
      eventNumber: event.eventNumber,
    };

    fetch(`${cgroup90}/api/post/relatedevents`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventNumberObj),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);

        if (data.length === 1) {
          const event = data[0];
          navigation.navigate('Event Details', { event, traveler });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [event, navigation]);


  const handleEventPress = (rowData) => {
    const event = rowData;
    navigation.navigate('Event Details', { event, traveler });
  };
  return (
    <GradientBackground>
      <BackButton text={event.Details} />
      <Timeline
        style={styles.list}
        showTime={false}
        circleSize={20}
        circleColor='green'
        lineColor={'yellowgreen'}
        separatorStyle={{
          backgroundColor: '#144800',
          height: 2,
        }}
        data={events}
        timeStyle={{
          textAlign: 'center',
          backgroundColor: 'green',
          color: 'white',
          padding: 8,
          borderRadius: 13,

        }}
        innerCircle='dot'
        options={{
          style: { paddingTop: 40, paddingLeft: 25 },
        }}
        separator={true}
        onEventPress={handleEventPress}
        detailContainerStyle={{
          marginBottom: 20,
          paddingLeft: 5,
          paddingRight: 5,
          borderRadius: 10,

        }}
        renderDetail={(rowData) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title]}>{rowData.Details}</Text>
              <Text style={[styles.date]}>{rowData.EventDate.substring(0, 10)}</Text>
              <Text style={[styles.time]}>{rowData.EventTime.substring(0, 5)}</Text>
              <View style={styles.descriptionContainer}>
                <Image source={{ uri: rowData.Picture }} style={styles.image} />
              </View>
            </View>
          </View>
        )}

      />
    </GradientBackground>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120,
    backgroundColor: 'white',
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'gray',
  },
  list: {
    flex: 1,
    marginTop: 90,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'gray',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    //  borderRadius: 25,
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray',
  },
});    
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';
import GradientBackground from '../Components/GradientBackground';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BackButton from '../Components/BackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoadRanger from '../assets/RoadRanger.png';
import Icon from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { cgroup90 } from '../cgroup90';


const HomeChat = (props) => {
  const navigation = useNavigation();
  const traveler = props.route.params;
  const [travelers, setTravelers] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [activeChatsSH, setActiveChatsSH] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalSH, setShowModalSH] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockHolders, setStockHolders] = useState([]);



  useEffect(() => {
    fetch(`${cgroup90}/api/Traveler`)
      .then((response) => response.json())
      .then((data) => {
        setTravelers(data);
        console.log(data)
      })
      .catch((error) => console.error(error));

  }, []);
  useEffect(() => {
    const insuranceObj = {
      insurence_company: traveler.insurence_company
    }
    console.log("SSS", insuranceObj)
    fetch(`${cgroup90}/api/stakeholders`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(insuranceObj),
    })

      .then((response) => response.json())
      .then((data) => {
        setStockHolders(data);
        console.log(data)
      })
      .catch((error) => console.error(error));

  }
    , []);
  useFocusEffect(() => {

    const getActiveChats = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('activeChats');
        if (jsonValue !== null) {
          setActiveChats(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    getActiveChats();
  });
  const handleUserPress = async (user, loggeduser) => {
    const isUserPresent = activeChats.find((chatUser) => chatUser.traveler_id === user.traveler_id);
    if (!isUserPresent) {
      const updatedActiveChats = [user, ...activeChats];
      setActiveChats(updatedActiveChats);
      try {
        await AsyncStorage.setItem('activeChats', JSON.stringify(updatedActiveChats));
      } catch (e) {
        console.error(e);
      }
    }
    console.log(user, loggeduser)
    navigation.navigate('Chat', { user, loggeduser });
  };

  const handleUserSH = async (user, loggeduser) => {
    const isSHPresent = activeChatsSH.find((chatUser) => chatUser.StakeholderId === user.StakeholderId);
    if (!isSHPresent) {
      const updatedActiveChats = [user, ...activeChatsSH];
      setActiveChatsSH(updatedActiveChats);
      try {
        await AsyncStorage.setItem('activeChatsSH', JSON.stringify(updatedActiveChats));
      } catch (e) {
        console.error(e);
      }
    }
    console.log(user, loggeduser)
    navigation.navigate('Chat withSH', { user, loggeduser });

  }


  const handleClearActiveChats = async () => {
    try {
      await AsyncStorage.removeItem('activeChats');
      setActiveChats([]);
    } catch (e) {
      console.error(e);
    }
  };
  const renderRightActions = (user) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteChat(user)}>
      <Icon name="trash-outline" size={35} />
    </TouchableOpacity>
  );

  const handleDelete = async (user) => {
    const updatedActiveChats = activeChats.filter((chatUser) => chatUser.traveler_id !== user.traveler_id);
    setActiveChats(updatedActiveChats);
    try {
      await AsyncStorage.setItem('activeChats', JSON.stringify(updatedActiveChats));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackButton text="Chat" />
      <GradientBackground>

        <View style={styles.container}>


          <ScrollView>

            <View>
              <Image source={{ uri: traveler.Picture }} style={styles.user} />
              <Text style={styles.name}>
                {traveler.first_name} {traveler.last_name}
              </Text>
            </View>

            <View
              style={styles.chatContainer}
            >
              <ScrollView>
                <TouchableOpacity style={styles.row} onPress={handleClearActiveChats}>
                  <Icon name="trash-outline" size={35} style={styles.icon} />
                  <Text style={styles.text}>Clear all chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={() => setShowModal(true)}>
                  <Icon name="search-outline" size={35} style={styles.icon} />
                  <Text style={styles.text}>Search traveler </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={() => setShowModalSH(true)}>
                  <Icon name="search-outline" size={35} style={styles.icon} />
                  <Text style={styles.text}>Insurance company represenative </Text>
                </TouchableOpacity>
                <Modal
                  visible={showModal}
                  animationType='slide'
                  transparent={true}
                  onRequestClose={() => setShowModal(false)}
                >
                  <View style={styles.modal}>
                    <TouchableOpacity onPress={() => setShowModal(false)} style={styles.btnClose}>
                      <Icon name="close-outline" size={35} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search for a user"
                      onChangeText={setSearchQuery}
                      value={searchQuery}
                    />

                    <ScrollView>
                      {travelers
                        .filter(traveler1 => traveler1.first_name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((traveler1) => (
                          <TouchableOpacity key={traveler1.id} onPress={() => {
                            handleUserPress(traveler1, traveler);
                            setShowModal(false);
                          }}>
                            <View style={styles.row}>
                              <Image style={styles.img} source={{ uri: traveler1.Picture }} />
                              <Text style={styles.text}>{traveler1.first_name} {traveler1.last_name} </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                </Modal>
                <Modal
                  visible={showModalSH}
                  animationType='slide'
                  transparent={true}
                  onRequestClose={() => setShowModalSH(false)}
                >
                  <View style={styles.modal}>
                    <TouchableOpacity onPress={() => setShowModalSH(false)} style={styles.btnClose}>
                      <Icon name="close-outline" size={35} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search for Insurance company represenative"
                      onChangeText={setSearchQuery}
                      value={searchQuery}
                    />

                    <ScrollView>
                      {stockHolders
                        .filter(stockHolders1 => stockHolders1.FullName.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((stockHolders1) => (
                          <TouchableOpacity key={stockHolders1.StakeholderId} onPress={() => {
                            handleUserSH(stockHolders1, traveler);
                            setShowModalSH(false);
                          }}>
                            <View style={styles.row}>
                              <Image style={styles.img} source={{ uri: stockHolders1.picture }} />
                              <Text style={styles.text}>{stockHolders1.FullName} </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                </Modal>
                <TouchableOpacity style={styles.row} onPress={() => { navigation.navigate("Group chat", traveler) }}>
                  <Image style={styles.img} source={{ uri: 'https://img.fruugo.com/product/1/86/14364861_max.jpg' }} />
                  <Text style={styles.text}>
                    Group chat
                  </Text>
                </TouchableOpacity>
                {activeChats.map((traveler2) => (
                  <Swipeable
                    renderRightActions={() => renderRightActions(traveler2)}
                    onSwipeableRightOpen={() => handleDelete(traveler2)}
                  >
                    <TouchableOpacity onPress={() => handleUserPress(traveler2, traveler)}>
                      <View style={styles.row}>
                        <Image style={styles.img} source={{ uri: traveler2.Picture }} />
                        <Text style={styles.text}>{traveler2.first_name}</Text>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>

                ))}
                {activeChatsSH.map((Stakeholder2) => (
                  <Swipeable
                    renderRightActions={() => renderRightActions(Stakeholder2)}
                    onSwipeableRightOpen={() => handleDelete(Stakeholder2)}
                  >
                    <TouchableOpacity onPress={() => handleUserSH(Stakeholder2, traveler)}>
                      <View style={styles.row}>
                        <Image style={styles.img} source={{ uri: Stakeholder2.picture }} />
                        <Text style={styles.text}>{Stakeholder2.FullName}</Text>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>

                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </GradientBackground>

    </GestureHandlerRootView>


  );
};

export default HomeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
    paddingBottom:40
  },
  searchInput: {
    padding: 20,
    fontSize: 20
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
  btnClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  row: {

    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'white',
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    padding: 10,
    // width:'70%'
    borderColor: 'rgba(0, 0, 0, 0.07)',
    borderWidth: 2,
    borderRadius: 15,
    margin: 5
  },
  group: {
    top: 20
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
    top: 0,
  },
  groupChatBtn: {
    top: 20,
    marginVertical: 20,
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
  RoadRanger: {
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 100

  },
  chatContainer: {
    borderRadius: 15,
    padding: 10,
    top: 20,
    marginBottom:30

  },
  back: {
    paddingTop: 30,
    marginLeft: 20
  },
  user: {
    alignSelf: 'center',
    height: 150,
    borderRadius: 75,
    width: 150,

  },
  name: {
    position: "absolute",
    fontSize: 20,
    alignSelf: 'center',
    top: 150
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 100,
    marginBottom: 100,
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  clear: {
    position: 'absolute',
    right: 20
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    position: 'absolute',
    right: 0,
  },
});

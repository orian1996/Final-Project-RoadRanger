import React, { useLayoutEffect,  useCallback, useState } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { collection, doc, addDoc, query, where, getDocs, orderBy, onSnapshot} from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { v4 as uuidv4 } from 'uuid';
import { cgroup90 } from "../cgroup90";
import Icon from "react-native-vector-icons/Ionicons";
import ChatBackground from "../Components/ChatBackground";

export default function Chat(props) {

    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const chosenUser = props.route.params.user;
    const userLogged = props.route.params.loggeduser;
    const [chatRoomDocRef, setChatRoomDocRef] = useState('')
    const [shouldRender, setShouldRender] = useState(false); // add state variable
    const [isStackholder, setisStackhold] = useState(true);

    const onSignOut = () => {
        signOut(auth).catch(error => console.log(error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 10 }} onPress={onSignOut}>
                    <Text> Hi</Text>
                </TouchableOpacity>
            )
        });
    }, [navigation]);



    const createChatRoom = async () => {
        const sortedUsers = [`99${userLogged.StakeholderId}`, chosenUser.traveler_id].sort();
        const chatRoomQuery = query(collection(database, 'chat_rooms'), where('users', '==', sortedUsers));
        const chatRoomQuerySnapshot = await getDocs(chatRoomQuery);
        if (chatRoomQuerySnapshot.size !== 0) {
            const existingChatRoomRef = chatRoomQuerySnapshot.docs[0].ref;
            setChatRoomDocRef(chatRoomQuerySnapshot.docs[0].ref);
            const messagesRef = collection(database, 'chat_rooms', existingChatRoomRef.id, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messages = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        _id: uuidv4(),
                        createdAt: data.createdAt.toDate(),
                        text: data.text,
                        user: data.user
                    };
                });         
                setMessages(messages);
                setShouldRender(false); 
            });
            return false; 
        } else {
            const newChatRoomDocRef = await addDoc(collection(database, 'chat_rooms'), {
                users: sortedUsers,
                messages: []
            });
            setChatRoomDocRef(newChatRoomDocRef);
            return true; 
        }
    };

    useLayoutEffect(() => {
        const getMessages = async () => {          
            const isNewChatRoom = await createChatRoom();
            if (!isNewChatRoom) {
                const messagesRef = collection(database, 'chat_rooms', chatRoomDocRef.id, 'messages');
                const q = query(messagesRef, orderBy('createdAt', 'desc'));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const messages = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            _id: uuidv4(),
                            createdAt: data.createdAt.toDate(),
                            text: data.text,
                            user: data.user
                        };
                    });
                    setMessages(messages);
                    setShouldRender(false); 
                });

                return () => {
                    unsubscribe();
                };
            }
        };

        getMessages();
    }, [userLogged, chosenUser]);


    const onSend = useCallback(async (newMessages = []) => {
        const messagesRef = chatRoomDocRef ? collection(database, `chat_rooms/${chatRoomDocRef.id}/messages`) : null;
        
        if (messagesRef) {
          const isStakeholder = !!userLogged.StakeholderId;
          setisStackhold(isStackholder); // check if user is a stakeholder
      
          try {
            const promises = newMessages.map(async (message) => {
              const createdAt = new Date();
              const messageData = {
                _id: uuidv4(), 
                text: message.text,
                createdAt: createdAt,
                user: {
                  _id: isStackholder ? `99${userLogged.StakeholderId}` : userLogged.traveler_id,
                  avatar: isStackholder ? userLogged.picture : userLogged.Picture,
                },
              };
      
              await handlePushNotification(messageData, chosenUser.token); 
              setMessages((previousMessages) => GiftedChat.append(previousMessages, messageData));
              return addDoc(messagesRef, messageData);
            });
      
            await Promise.all(promises);
          } catch (error) {
          }
        }
      }, [userLogged, chosenUser, chatRoomDocRef]);
      
    const handlePushNotification =  (message, recipientToken) => {
        const notification = {
            to: recipientToken,
            title: `You have new message`,
            body: message.text,
            data: { chatRoomDocRefId: chatRoomDocRef.id },
        };
   
        fetch(`${cgroup90}/sendpushnotification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification),
        })
            .then(response => response.json())
            .then(data => {})
            .catch(error => {
                console.error(error);
                Alert.alert('Error', error);
            });


    };

    return (
        <ChatBackground>
            <View style={styles.hamburger}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-outline" size={30} color='#144800' />
                </TouchableOpacity>

                <View style={styles.user}>
                    <Image style={styles.img} source={{ uri: chosenUser.Picture }} />

                </View>
                <View style={styles.user}>
                    <Text style={styles.text}>{chosenUser.first_name} {chosenUser.last_name} </Text>
                </View>

            </View>
            <View style={styles.container}>

                {messages && (
                    <GiftedChat
                        isTyping={true}
                        showAvatarForEveryMessage={true}
                        messages={messages}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: isStackholder ? `99${userLogged.StakeholderId}` : userLogged.traveler_id,
                            avatar: isStackholder ? userLogged.picture : userLogged.Picture
                        }}
                    />
                )}
            </View>
        </ChatBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 30,
    },
    back: {
        paddingTop: 30,
        marginLeft: 20
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
        fontWeight: 'bold',
        fontSize: 25,
        color: '#144800',
        fontSize: 32,
        alignSelf: 'center',
        paddingLeft: 30,
    },
    row: {
        marginBottom: 20,
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        shadowOpacity: 0.5,
    },
    user: {
        left: 10,
        top: 0,


    },
    button: {
        alignSelf: 'center',
    },
    hamburger: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        height: '12%',
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 55,
        paddingHorizontal: 20,
        shadowOpacity: 0.95,

    },
  
})

import React, { useLayoutEffect, useEffect, useCallback, useState, useRef } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { collection, doc, addDoc, query, where, getDocs, orderBy, onSnapshot, push, ref } from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import GradientBackground from '../Components/GradientBackground';
import BackButton from "../Components/BackButton";
import { v4 as uuidv4 } from 'uuid';
//import * as Notifications from 'expo-notifications';
import { async } from "@firebase/util";
import { cgroup90 } from '../cgroup90';
import Icon from "react-native-vector-icons/Ionicons";
import ChatBackground from "../Components/ChatBackground";

export default function ChatWithSH(props) {

    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const chosenUser = props.route.params.user;
    const userLogged = props.route.params.loggeduser;
    const [chatRoomDocRef, setChatRoomDocRef] = useState('')
    const [shouldRender, setShouldRender] = useState(false); // add state variable
const [isStackholder, setisStackhold] = useState(false);

    console.log('im the logged user', userLogged);
    console.log('im the chosen one!', chosenUser);

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
        const sortedUsers = [`99${chosenUser.StakeholderId}`, userLogged.traveler_id].sort();
        const chatRoomQuery = query(collection(database, 'chat_rooms'), where('users', '==', sortedUsers));
        const chatRoomQuerySnapshot = await getDocs(chatRoomQuery);
        if (chatRoomQuerySnapshot.size !== 0) {
            const existingChatRoomRef = chatRoomQuerySnapshot.docs[0].ref;
            setChatRoomDocRef(chatRoomQuerySnapshot.docs[0].ref);
            console.log('Chat room exists');
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
                // console.log('Fetched messages:', messages); // add this line
                setMessages(messages);
                setShouldRender(false); // update state variable to trigger re-render
            });
            return false; // indicate that chat room already exists
        } else {
            const newChatRoomDocRef = await addDoc(collection(database, 'chat_rooms'), {
                users: sortedUsers,
                messages: []
            });
            setChatRoomDocRef(newChatRoomDocRef);
            console.log('Chat room created');
            return true; // indicate that new chat room was created
        }
    };

    useLayoutEffect(() => {
        const getMessages = async () => {
            // Call createChatRoom() to make sure chat room exists
            const isNewChatRoom = await createChatRoom();
            if (!isNewChatRoom) {
                // If a new chat room was created, do any necessary setup here
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
                    // console.log('Fetched messages:', messages); // add this line
                    setMessages(messages);
                    setShouldRender(false); // update state variable to trigger re-render
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
            setisStackhold(isStackholder) // check if user is a stakeholder
            const promises = newMessages.map((message) => {
                const createdAt = new Date();
                const messageData = {
                    _id: uuidv4(), // add the generated ID to the message object
                    text: message.text,
                    createdAt: createdAt,
                    user: {
                        _id: isStackholder ? `99${userLogged.StakeholderId}` : userLogged.traveler_id,
                        avatar: isStackholder ? userLogged.picture : userLogged.Picture
                    }
                };
                setMessages((previousMessages) => GiftedChat.append(previousMessages, messageData));
               handlePushNotification(messageData, chosenUser.token); // send push notification to the recipient
                console.log("*********", chosenUser.token, messageData)
                return addDoc(messagesRef, messageData);
            });

            Promise.all(promises)
                .then(() => {
                    console.log('Messages sent');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [userLogged, chosenUser, chatRoomDocRef]);


    const handlePushNotification = async (message, recipientToken) => {
        // Construct the message payload
        const notification = {
            to: recipientToken,
            title: `New message from traveler`,
            body: message.text,
            data: { chatRoomDocRefId: chatRoomDocRef.id },
        };

        // Send the notification to the recipient         
        fetch(`${cgroup90}/sendpushnotification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notification),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
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
                    <Image style={styles.img} source={{ uri: chosenUser.picture }} />

                </View>
                <View style={styles.user}>
                    <Text style={styles.text}>{chosenUser.FullName}  </Text>
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
        marginBottom: 30
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

        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%',
    },
    user: {
        left: 10,
        top: 0,


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
    button: {
        alignSelf: 'center',
    },
})

import React, { useLayoutEffect, useCallback, useState } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, addDoc, orderBy, query, onSnapshot } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { auth, database } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import GradientBackground from '../Components/GradientBackground';
import BackButton from "../Components/BackButton";
import ChatBackground from "../Components/ChatBackground";
import { v4 as uuidv4 } from 'uuid';



export default function GroupChat(props) {
    const navigation = useNavigation();
    const [message, setMessage] = useState([]);

const traveler = props.route.params;
console.log(traveler.Picture)
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

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats1');
        const q = query(collectionRef,orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, snapshot => {
            console.log('snapshot');
            setMessage(
                snapshot.docs.map(doc => ({
                    _id: uuidv4(),
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });
        return () => unsubscribe();
    },[]);

    
    const onSend= useCallback((message=[])=>{
        console.log('user', message[0])
        setMessage(prevmesseg => GiftedChat.append(prevmesseg,message));
        const {_id,createdAt, text, user}= message[0];
        console.log('user', user)

        addDoc(collection(database,'chats1'),{
            _id,
            createdAt,
            text,
            user
        });
    },[])
    return (
        <View style={styles.container}>
            <ChatBackground>
            <BackButton />
            <View style={styles.hamburger}>
                    <Text style={styles.text}>Group Chat </Text>
                </View>
            <GiftedChat 
            showAvatarForEveryMessage={true}
            messages={message}
            onSend={message => onSend(message)}
            user={{
                _id: traveler.travler_email,
                avatar: traveler.Picture
            }}

            />
            </ChatBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 40,
        marginBottom: 30
    },

    text: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#144800',
        fontSize: 32,
        alignSelf: 'center',
        paddingLeft: 30,
    },
    hamburger: {
        flexDirection: 'row',
        height: '14%',
         top: 0,
         left: 75,
         zIndex: 1,
    },
})
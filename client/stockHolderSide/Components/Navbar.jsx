import { TouchableOpacity, StyleSheet, Text, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
import React, { useState} from 'react';
import { AntDesign } from '@expo/vector-icons';


function Navbar(props) {
    const navigation = useNavigation();
    const stakeholder = props.stakeholder;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <View style={styles.hamburger1}>
            <TouchableOpacity onPress={() => setIsMenuOpen(true) } style={styles.icon1} >
                <Icon name="menu" size={30} color="#144800" alignItems='center' />
                <Text style={styles.text1}>Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {navigation.navigate( "Your Travelers", { stakeholder }), setIsMenuOpen(false)} }style={styles.icon1}>
                <Icon name="people" size={30} color="#144800" alignItems='center' />
                <Text style={styles.text1}>My Travelers</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { navigation.navigate("Home chat", { stakeholder: stakeholder }), setIsMenuOpen(false) }} style={styles.icon1}>
                <Icon name="chatbubble-ellipses" size={30} color="#144800" alignItems='center' />
                <Text style={styles.text1}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { navigation.navigate("Around You",{ stakeholder: stakeholder }), setIsMenuOpen(false) }} style={styles.icon1} >
                <Icon name="home" size={30} color="#144800" alignItems='center' />
                <Text style={styles.text1}>Home</Text>
            </TouchableOpacity>


            <Modal
                visible={isMenuOpen}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setIsMenuOpen(false)}
            >
                {isMenuOpen && (
                    <View style={styles.menu}>
                        <TouchableOpacity style={styles.btnLogOut} onPress={() => {
                            navigation.navigate("Sign In"), setIsMenuOpen(false);
                        }}>
                            <Text style={styles.textLO} > Log out  </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.option}
                                onPress={() => { navigation.navigate("Home chat", { stakeholder: stakeholder }), setIsMenuOpen(false) }}
                            >

                                <Icon name="chatbubble-ellipses-outline" size={30} style={styles.icon} />
                                <Text style={styles.text}>Chat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option}
                                onPress={() => {
                                    navigation.navigate("New event", {
                                        stakeholder: stakeholder,
                                    }), setIsMenuOpen(false);
                                }}
                            >
                                <Icon name="add-circle-outline" size={30} style={styles.icon} />
                                <Text style={styles.text}>New Warning</Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option}
                                onPress={() => { navigation.navigate("Your Travelers", { stakeholder }), setIsMenuOpen(false) }}>

                                <Icon name="people-outline" size={30} style={styles.icon} />
                                <Text style={styles.text}>My Travelers</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate("Search", { stakeholder }), setIsMenuOpen(false) }}>
                                <Icon name="search-outline" size={30} style={styles.icon} />
                                <Text style={styles.text}>Search </Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option}
                                onPress={() => { navigation.navigate("Missing Travelers", { stakeholder }), setIsMenuOpen(false) }}
                            >
                                  <Icon name="body-outline" size={35} style={styles.icon} />
                                <Text style={styles.text}>Missing Travelers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.option}
                                onPress={() => {
                                    navigation.navigate("Warning", {
                                        stakeholder: stakeholder,
                                    }), setIsMenuOpen(false) }}  >
                                <Icon name="warning-outline" size={30} style={styles.icon} />
                                <Text style={styles.text}>Warnings </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Modal>
        </View>


    );
}

const styles = StyleSheet.create({
    hamburger1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
        height: '10%',
        bottom: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        shadowOpacity: 0.25,
    },
    text1: {
        color: '#144800',
        fontSize: 17,

    },
    icon1: {
         color: '#144800',
        alignItems: 'center',
        size: 30,
        top: 10
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '60%',
        backgroundColor: 'white',
        zIndex: 1,
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderbottomEndRadius: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'space-evenly',
    },
    closeButton: {
        right: -80,
        paddingTop: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
        height: '100%',
        marginTop:150,
    },
    optionSOS: {
        alignContent: 'center',
        height: '15%',
        width: '100%',
        borderColor: '#DCDCDC',
        borderWidth: 0.5,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        marginBottom: 10,

        padding: 5,
        resizeMode: 'contain',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    option: {
        alignContent: 'center',
        height: '18%',
        width: '48%',
        borderColor: '#DCDCDC',
        borderWidth: 0.5,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        marginBottom: 10,
        padding: 5,
        resizeMode: 'contain',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        
    },
    text: {
        color: '#144800',
        fontSize: 23,
        alignSelf: 'center',
        paddingBottom: 2,
    },
    textSOS: {
        fontSize: 23,
        alignSelf: 'center',
        paddingBottom: 2,
        color: '#B00020',

    }, iconSOS: {
        alignSelf: 'center',
        alignItems: 'center',
         size: 30,
        color: '#B00020',

    },
    textModal: {
        fontSize: 25,
        margin: 10
    },
    btnLogOut: {
        left: -80,
        paddingTop: 10,
    },
    textLO: {
        color: '#144800',
        fontSize: 20,
        textDecorationLine: 'underline',

    },
    icon: {
        alignSelf: 'center',
        color: '#144800',
        alignItems: 'center',
        size: 30,
        marginTop:10


    },

    user: {
        width: 50,
        height: 50,
        borderRadius: 90 / 2,
        resizeMode: 'cover',
        right: -10,
        top: -5,
        alignSelf: 'flex-end'

    },
    img: {
        alignSelf: 'center',
        height: 200,
        borderRadius: 20,
        width: 150,
    },
    rowModal: {
        flexDirection: 'row',
        alignSelf: "center",
        marginTop: 20
    },
});

export default Navbar;
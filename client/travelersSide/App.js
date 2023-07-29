import { StatusBar } from 'expo-status-bar';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import AroundYou from './Screens/AroundYou';
import Setting from './Screens/Setting'
import ContactUs from './Screens/ContactUs';
import NewEvent from './Screens/NewEvent';
import AskForHelp from './Screens/AskForHelp';
import Search from './Screens/Search'
import Events from './Screens/Events';
import MyPost from './Screens/MyPost';
import TimeLine from './Screens/TimeLine'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ForgotPassword from './Screens/ForgotPassword';
import EventDetails from './Screens/EventDetails';
import OpenCamera from './Components/OpenCamera';
import OpenCameraE from './Components/OpenCameraE';
import OpenCameraSOS from './Components/OpenCameraSOS';
import Chat from './Screens/Chat';
import HomeChat from './Screens/HomeChat';
import BackButton from './Components/BackButton';
import GroupChat from './Screens/GroupChat'
import { StyleSheet } from 'react-native';
import ChatWithSH from './Screens/ChatWithSH';
import Warning from './Screens/Warning';
import LocationContextProvider from './Context/LocationContext'
import EventsContextProvider from './Context/EventsContext';
import SOS from './Screens/SOS';
import MissingTravelers from './Screens/MissingTravelers';
import MissingDetails from './Screens/MissingDetails';
const Stack = createNativeStackNavigator()

export default function App() {


  return (
    <EventsContextProvider>
      <LocationContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Sign In" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sign In" component={SignIn} />
            <Stack.Screen name="Sign Up" component={SignUp} />
            <Stack.Screen name="Around You" component={AroundYou} />
            <Stack.Screen name="Contact Us" component={ContactUs} />
            <Stack.Screen name="Forgot password" component={ForgotPassword} />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="New event" component={NewEvent} />
            <Stack.Screen name="Ask For Help" component={AskForHelp} />
            <Stack.Screen name="TimeLine" component={TimeLine} />
            <Stack.Screen name="Camera" component={OpenCamera} />
            <Stack.Screen name="CameraE" component={OpenCameraE} />
            <Stack.Screen name="CameraSOS" component={OpenCameraSOS} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Event Details" component={EventDetails} />
            <Stack.Screen name="Events" component={Events} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Home chat" component={HomeChat} />
            <Stack.Screen name="BackButton" component={BackButton} />
            <Stack.Screen name="My Post" component={MyPost} />
            <Stack.Screen name="Group chat" component={GroupChat} />
            <Stack.Screen name="Chat withSH" component={ChatWithSH} />
            <Stack.Screen name="Warning" component={Warning} />
            <Stack.Screen name="SOS" component={SOS} />
            <Stack.Screen name="Missing Travelers" component={MissingTravelers} />
            <Stack.Screen name="Missing Details" component={MissingDetails} />

          </Stack.Navigator>
        </NavigationContainer>
      </LocationContextProvider>
    </EventsContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
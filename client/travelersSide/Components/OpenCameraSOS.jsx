import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View ,Alert} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { cgroup90 } from '../cgroup90';

export default function OpenCameraE(props) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [setAnimate] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const ide = props.route.params.idE;
  const idee = ide.replace(':', '_')
  console.log("1", idee)
  const takePicture = async () => {
    if (camera) {
      try {
        const photo = await camera.takePictureAsync({
          quality: 0.1,
          base64: true,
          width:500
        });
        setImage(photo);
        const pic64base = photo.base64;
        const picName64base = `SOS_${idee}.jpg `;
        const picUri = `data:image/gif;base64,${photo.base64}`;
        const formData = new FormData();
        formData.append('file', { uri: picUri, name: picName64base, type: 'image/jpeg' });

        // Add the following lines to call the uploadBase64ToASMX function
        setAnimate(true);
        const urlAPI = `${cgroup90}/uploadeventpicture`
        fetch(urlAPI, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            setAnimate(false);
          })
          .catch((error) => {
            console.error(error);
            setAnimate(false);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openGallery = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      quality: 0.1,
      base64: true,
    });
    console.log({ pickerResult }); // Log the pickerResult object
    if (pickerResult.cancelled) {
      console.log('Image selection cancelled'); // Handle cancel event
    } else {
      const image = { uri: pickerResult.uri };
      setImage(image);
      const pic64base = pickerResult.base64;
      const picName64base = `SOS_${idee}.jpg`;
      console.log(picName64base);
      const picUri = `data:image/jpeg;base64,${pickerResult.base64}`;
      const formData = new FormData();
      formData.append('file', { uri: picUri, name: picName64base, type: 'image/jpeg' });
  
      // Add the following lines to call the uploadBase64ToASMX function
      setAnimate(true);
      const urlAPI = `${cgroup90}/uploadeventpicture`
      fetch(urlAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("1", responseJson);
          setAnimate(false);
        })
        .catch((error) => {
          console.error(error);
          setAnimate(false);
        });
    }
  }
  

const savePhoto = () => {
  Alert.alert("your picture has uploaded :)")
  navigation.goBack();
};
const closeCamera = () => {
  navigation.goBack(); // navigate to the previous screen
}

return (
  <View style={styles.container}>
    {image ? (
      <View style={styles.preview}>
        <Image style={styles.previewImage} source={{ uri: image.uri }} />
        <TouchableOpacity style={styles.previewButton} onPress={() => setImage(null)}>
          <Icon name="close-outline" size={35} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.save} onPress={savePhoto} >
          <Icon name="download-outline" size={35} />
          <Text style={styles.textSave}>Save</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Camera style={styles.camera} type={type} ref={(ref) => { setCamera(ref) }}>
        <TouchableOpacity style={styles.buttonClose} onPress={closeCamera}>
          <Icon name="close-outline" size={35} color='white' />
        </TouchableOpacity>
        <View style={styles.buttonContainer} >
          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Icon name="images-outline" size={45} color='white' style={styles.iconLeft} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Icon name="radio-button-on-outline" size={100} color='white' style={styles.iconCenter} />

          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Icon name="sync-circle-outline" size={45} color='white' style={styles.iconRight} />
          </TouchableOpacity>
        </View>
      </Camera>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonClose: {
    position: 'absolute',
    top: 32,
    right: 16
  },
  iconRight: {
    left: 40
  },
  iconLeft: {
    right: 40
  },
  iconCenter: {
    bottom: 30
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewButton: {
    position: 'absolute',
    top: 32,
    right: 16
  },
  save: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  textSave: {
    fontSize: 25,
    marginTop: 10

  }
});
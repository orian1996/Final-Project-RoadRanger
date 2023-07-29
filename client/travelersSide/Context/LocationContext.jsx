import { createContext, useState, useEffect } from 'react'
import * as Location from 'expo-location';

export const LocationContext = createContext();

export default function LocationContextProvider({ children }) {

    const [location, setLocation] = useState('');
    const [permission, setPermission] = useState(false);
    const getPermissionLocation = async () => {
        if (!permission) {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            if (status == 'granted') {
                setPermission(true);
            }
        }
    }
    const getUserLocation = async () => {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc)
    }
    const revokedPermission = ()=>{
        setPermission(false);
    }
    value = {
        location,
        getPermissionLocation,
        getUserLocation
    }
    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    )
}
import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { apiUrl } from './constants/constants';

export const LocationContext = React.createContext();

export default function LocationContextComp({children}) {

  console.log("location context running")
  const [locationState, setLocationState] = useState({
    latitude: 0,
    longitude: 0,
    address: ""
  });

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0, longitude: 0
  })

  useEffect(() => {
    // Check if geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(()=>{
    getCurrentPlace();
  }, [currentLocation])

  async function getCurrentPlace() {
    if (currentLocation.latitude && currentLocation.longitude) {
      const data = await axios(`${apiUrl}location/currentplace?lat=${currentLocation.latitude}&long=${currentLocation.longitude}`);
      setLocationState({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: data.data.data?.results[0].formatted_address
      })
    }
  }

  return (
      <LocationContext.Provider value={{locationState}}>
        {children}
      </LocationContext.Provider>
  )
}

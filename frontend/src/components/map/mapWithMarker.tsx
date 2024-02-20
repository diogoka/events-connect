import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { setKey, fromAddress } from 'react-geocode';

type Coordinate = {
  lat: number;
  lng: number;
};

type Props = {
  location: string;
}

export default function MapWithMarker({ location }: Props) {

  const [coordinate, setCoordinate] = useState<Coordinate>();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY!,
  });

  useEffect(() => {
    if (location) {
      setKey(process.env.NEXT_PUBLIC_API_KEY!);
      fromAddress(location)
        .then(({ results }) => {
          const { lat, lng } = results[0].geometry.location;
          setCoordinate({ lat: lat, lng: lng });
        })
        .catch(console.error);
    }

  }, [location])

  return (isLoaded && coordinate) && (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '250px',
        borderRadius: '7px',
      }}
      center={coordinate}
      zoom={14}
    >
      <MarkerF position={coordinate} />
    </GoogleMap>
  )
}

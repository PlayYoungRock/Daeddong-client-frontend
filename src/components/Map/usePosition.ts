import { useEffect, useState } from 'react';

type PositionType = { lat: number; lng: number };

export const defaultPosition = { lat: 37.5666805, lng: 126.9784147 };

export const usePosition = (map: naver.maps.Map | null) => {
  const [position, setPosition] = useState<PositionType>(defaultPosition);

  const setCurrentUserPosition = () =>
    navigator.geolocation.getCurrentPosition(
      (position) => setPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setPosition(defaultPosition),
    );

  useEffect(() => {
    if (!map) return;

    map.setCenter(position);
  }, [map, position]);

  useEffect(() => {
    setCurrentUserPosition();
  }, []);

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        result.onchange = setCurrentUserPosition;
      }
    });
  }, []);

  return { position };
};

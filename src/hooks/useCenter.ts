import { MapContext } from '@/components';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

export const useCenter = () => {
  const { map, isCreatedMap } = useContext(MapContext);
  const [center, setCenter] = useState({ lat: 37.5666103, lng: 126.9783882 });
  const value = useDebounce(center, 500);

  const moveCenter = useCallback(() => {
    const naverMap = map.current;
    if (!naverMap || !isCreatedMap) return;

    navigator.geolocation.getCurrentPosition((position) =>
      naverMap.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
    );
  }, [map, isCreatedMap]);

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then(({ state, onchange }) => {
      if (state === 'granted' || state === 'prompt') {
        onchange = moveCenter;
      }
    });
  }, [moveCenter]);

  useEffect(() => {
    moveCenter();
  }, [moveCenter]);

  useEffect(() => {
    const naverMap = map.current;
    if (!isCreatedMap || !naverMap) return;

    const listener = naver.maps.Event.addListener(naverMap, 'center_changed', (e) =>
      setCenter({ lat: e.lat(), lng: e.lng() }),
    );

    return () => naver.maps.Event.removeListener(listener);
  }, [isCreatedMap, map]);

  return { center: value };
};

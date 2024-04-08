import { MapContext } from '@/components';
import { useCallback, useContext, useEffect } from 'react';

export const useCenter = () => {
  const { map, status } = useContext(MapContext);

  const moveCenter = useCallback(() => {
    const naverMap = map.current;
    if (!naverMap || !status) return;

    navigator.geolocation.getCurrentPosition((position) =>
      naverMap.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
    );
  }, [map, status]);

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
};

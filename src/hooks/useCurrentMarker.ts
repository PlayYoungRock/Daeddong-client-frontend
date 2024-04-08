import { MapContext } from '@/components';
import { useCallback, useContext, useEffect, useRef } from 'react';

type useCurrentMarkerType = {
  onVisible: (e: naver.maps.PointerEvent) => void;
  onInVisible: (e: naver.maps.PointerEvent) => void;
};

export const useCurrentMarker = (option?: useCurrentMarkerType) => {
  const { isCreatedMap, map } = useContext(MapContext);
  const marker = useRef<naver.maps.Marker | null>(null);

  const handleVisibleMarker = useCallback(
    (e: naver.maps.PointerEvent) => {
      if (marker.current) {
        marker.current.setPosition(e.coord);
        marker.current.setVisible(true);
        if (option && option.onVisible) option.onVisible(e);
      }
    },
    [option],
  );

  const handleInVisibleMarker = useCallback(
    (e: naver.maps.PointerEvent) => {
      if (marker.current) {
        marker.current.setVisible(false);
        if (option && option.onInVisible) option.onInVisible(e);
      }
    },
    [option],
  );

  useEffect(() => {
    if (!isCreatedMap || !map.current) return;

    marker.current = new naver.maps.Marker({
      position: map.current.getCenter(),
      visible: false,
      map: map.current,
    });
  }, [map, isCreatedMap]);

  useEffect(() => {
    if (!isCreatedMap || !map.current) return;

    const webListener = naver.maps.Event.addListener(
      map.current,
      'rightclick',
      handleVisibleMarker,
    );
    const mobileListener = naver.maps.Event.addListener(
      map.current,
      'longtap',
      handleVisibleMarker,
    );
    const markerRemoveListener = naver.maps.Event.addListener(
      map.current,
      'click',
      handleInVisibleMarker,
    );

    return () => {
      naver.maps.Event.removeListener(webListener);
      naver.maps.Event.removeListener(mobileListener);
      naver.maps.Event.removeListener(markerRemoveListener);
    };
  }, [handleInVisibleMarker, handleVisibleMarker, map, isCreatedMap]);
};

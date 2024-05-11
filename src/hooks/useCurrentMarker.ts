import { useCallback, useEffect, useRef } from 'react';
import { useNaverMap } from './useNaverMap';
import { isMobile } from '@/constants';

type useCurrentMarkerType = {
  onVisible: (e: naver.maps.PointerEvent) => void;
  onInVisible: (e: naver.maps.PointerEvent) => void;
};

export const useCurrentMarker = (option?: useCurrentMarkerType) => {
  const map = useNaverMap();
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
    if (!map) return;

    marker.current = new naver.maps.Marker({
      position: map.getCenter(),
      visible: false,
      map: map,
    });
  }, [map]);

  useEffect(() => {
    if (!map || isMobile) return;

    const webListener = naver.maps.Event.addListener(map, 'rightclick', handleVisibleMarker);
    const markerRemoveListener = naver.maps.Event.addListener(map, 'click', handleInVisibleMarker);

    return () => {
      naver.maps.Event.removeListener(webListener);
      naver.maps.Event.removeListener(markerRemoveListener);
    };
  }, [handleInVisibleMarker, handleVisibleMarker, map]);

  useEffect(() => {
    if (!map || !isMobile) return;

    const mobileListener = naver.maps.Event.addListener(map, 'longtap', handleVisibleMarker);
    const markerRemoveListener = naver.maps.Event.addListener(map, 'tap', handleInVisibleMarker);

    return () => {
      naver.maps.Event.removeListener(mobileListener);
      naver.maps.Event.removeListener(markerRemoveListener);
    };
  }, [handleInVisibleMarker, handleVisibleMarker, map]);
  return marker.current;
};

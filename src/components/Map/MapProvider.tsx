import Script from 'next/script';
import React, {
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defaultPosition, usePosition } from './usePosition';

export const MapContext = createContext<MapContextType>({
  status: null,
  createMap: () => {},
  pointer: null,
  distance: 0,
});

type StatusType = boolean | null;

interface MapContextType {
  status: StatusType;
  createMap: (dom: HTMLElement) => void;
  pointer: naver.maps.PointerEvent | null;
  distance: number;
}

interface MapProviderProps {
  children: React.ReactNode;
}

const isLatLngBounds = (
  bounds: naver.maps.PointBounds | naver.maps.LatLngBounds,
): bounds is naver.maps.LatLngBounds => {
  return bounds instanceof naver.maps.LatLngBounds;
};

export const MapProvider = memo<MapProviderProps>(({ children }) => {
  const map = useRef<naver.maps.Map | null>(null);
  const marker = useRef<naver.maps.Marker | null>(null);

  const [status, setStatus] = useState<StatusType>(null);
  const [isCreatedMap, setIsCreatedMap] = useState(false);
  const [pointer, setPointer] = useState<naver.maps.PointerEvent | null>(null);
  const [distance, setDistance] = useState(0);

  // todo naver.maps을 활용할 것
  usePosition(map.current);

  const createMap = useCallback(
    (dom: HTMLElement) => {
      if (!status) return;

      map.current = new naver.maps.Map(dom, {
        center: new naver.maps.LatLng(defaultPosition),
        zoom: 17,
      });
      marker.current = new naver.maps.Marker({
        position: map.current.getCenter(),
        visible: false,
        map: map.current,
      });

      setIsCreatedMap(true);
    },
    [status],
  );

  const handleCreateMark = useCallback((e: naver.maps.PointerEvent) => {
    if (marker.current) {
      setPointer(e);
      marker.current.setPosition(e.coord);
      marker.current.setVisible(true);
    }
  }, []);

  const handleRemoveMark = useCallback((e: naver.maps.PointerEvent) => {
    if (marker.current) {
      setPointer(null);
      marker.current.setVisible(false);
    }
  }, []);

  // marker 클릭
  useEffect(() => {
    if (!isCreatedMap) return;

    const webListener = naver.maps.Event.addListener(map.current, 'rightclick', handleCreateMark);
    const mobileListener = naver.maps.Event.addListener(map.current, 'longtap', handleCreateMark);
    const markerRemoveListener = naver.maps.Event.addListener(
      map.current,
      'click',
      handleRemoveMark,
    );

    return () => {
      naver.maps.Event.removeListener(webListener);
      naver.maps.Event.removeListener(mobileListener);
      naver.maps.Event.removeListener(markerRemoveListener);
    };
  }, [handleCreateMark, handleRemoveMark, isCreatedMap]);

  // 거리계산
  useEffect(() => {
    if (!isCreatedMap) return;
    if (!map.current) return;

    const current = map.current;
    // 지도의 bounds와 동일한 크기의 사각형을 그립니다.
    const rect = new naver.maps.Rectangle({
      bounds: current.getBounds(),
      map: current,
      visible: false,
    });
    const bound = rect.getBounds();

    if (!isLatLngBounds(bound)) return;

    const line = new naver.maps.Polyline({
      path: [bound.getNE(), current.getCenter()],
      map: current,
      visible: false,
    });
    setDistance(line.getDistance());

    const getDistance = naver.maps.Event.addListener(current, 'bounds_changed', (bounds) => {
      window.setTimeout(() => {
        rect.setBounds(bounds);
        line.setPath([bounds.getNE(), current.getCenter()]);

        setDistance(line.getDistance());
      }, 500);
    });

    return () => naver.maps.Event.removeListener(getDistance);
  }, [isCreatedMap]);

  const value = useMemo(
    () => ({
      status,
      createMap,
      pointer,
      distance,
    }),
    [status, createMap, pointer, distance],
  );
  return (
    <MapContext.Provider value={value}>
      {children}
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
        onLoad={() => setStatus(true)}
        onError={() => setStatus(false)}
      ></Script>
    </MapContext.Provider>
  );
});
MapProvider.displayName = 'MapProvider';

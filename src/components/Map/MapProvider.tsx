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
});

type StatusType = boolean | null;

interface MapContextType {
  status: StatusType;
  createMap: (dom: HTMLElement) => void;
  pointer: naver.maps.PointerEvent | null;
}

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider = memo<MapProviderProps>(({ children }) => {
  const map = useRef<naver.maps.Map | null>(null);
  const marker = useRef<naver.maps.Marker | null>(null);

  const [status, setStatus] = useState<StatusType>(null);
  const [isCreatedMap, setIsCreatedMap] = useState(false);
  const [pointer, setPointer] = useState<naver.maps.PointerEvent | null>(null);

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

  const value = useMemo(
    () => ({
      status,
      createMap,
      pointer,
    }),
    [status, pointer, createMap],
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

import Script from 'next/script';
import React, { createContext, memo, useCallback, useMemo, useRef, useState } from 'react';

export const MapContext = createContext<MapContextType>({
  map: { current: null },
  status: null,
  isCreatedMap: false,
  createMap: () => {},
});

type StatusType = boolean | null;

interface MapContextType {
  map: React.MutableRefObject<naver.maps.Map | null>;
  status: StatusType;
  isCreatedMap: boolean;
  createMap: (dom: HTMLElement) => void;
}

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider = memo<MapProviderProps>(({ children }) => {
  const map = useRef<naver.maps.Map | null>(null);
  const [status, setStatus] = useState<StatusType>(null);
  const [isCreatedMap, setIsCreatedMap] = useState(false);

  const createMap = useCallback(
    (dom: HTMLElement) => {
      if (!status) return;

      map.current = new naver.maps.Map(dom, {
        zoom: 17,
      });
      setIsCreatedMap(true);
    },
    [status],
  );

  const value = useMemo(
    () => ({
      status,
      isCreatedMap,
      map,
      createMap,
    }),
    [status, isCreatedMap, createMap],
  );
  return (
    <MapContext.Provider value={value}>
      {children}
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
        onLoad={() => setStatus(true)}
        onError={() => setStatus(false)}
      ></Script>
    </MapContext.Provider>
  );
});
MapProvider.displayName = 'MapProvider';

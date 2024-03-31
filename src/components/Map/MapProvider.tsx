import Script from 'next/script';
import React, { createContext, memo, useCallback, useMemo, useRef, useState } from 'react';
import { defaultPosition, usePosition } from './usePosition';

export const MapContext = createContext<MapContextType>({
  status: null,
  createMap: () => {},
});

type StatusType = boolean | null;

interface MapContextType {
  status: StatusType;
  createMap: (dom: HTMLElement) => void;
}

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider = memo<MapProviderProps>(({ children }) => {
  const map = useRef<naver.maps.Map | null>(null);

  const [status, setStatus] = useState<StatusType>(null);
  // todo naver.maps을 활용할 것
  const { position } = usePosition(map.current);

  const createMap = useCallback(
    (dom: HTMLElement) => {
      if (!status) return;

      map.current = new naver.maps.Map(dom, {
        center: new naver.maps.LatLng(defaultPosition),
        zoom: 17,
      });
    },
    [status],
  );

  const value = useMemo(
    () => ({
      status,
      createMap,
    }),
    [status, createMap],
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

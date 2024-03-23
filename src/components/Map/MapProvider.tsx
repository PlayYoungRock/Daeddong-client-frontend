import Script from 'next/script';
import React, { createContext, memo, useState } from 'react';

export const MapContext = createContext<{ status: StatusType }>({ status: null });

type StatusType = boolean | null;

interface MapProviderProps {
  children: React.ReactNode;
}

export const MapProvider = memo<MapProviderProps>(({ children }) => {
  const [status, setStatus] = useState<StatusType>(null);

  return (
    <MapContext.Provider value={{ status: status }}>
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

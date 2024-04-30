import { useScript } from '@/hooks';
import { MutableRefObject, createContext, memo, useEffect, useRef, useState } from 'react';

interface NaverMapProviderProps {
  children: React.ReactNode;
}
const NAVER_MAP_SDK_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`;

export const NaverMapContext = createContext<{
  isLoading: boolean;
  naverMap: MutableRefObject<naver.maps.Map | null>;
} | null>(null);

export const NaverMapProvider = memo<NaverMapProviderProps>(({ children }) => {
  const [isLoadingNaverMap] = useScript({ src: NAVER_MAP_SDK_URL });
  const [isLoading, setIsLoading] = useState(true);
  const naverMap = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!isLoadingNaverMap) {
      naver.maps.onJSContentLoaded = () => {
        setIsLoading(false);
      };
    }
  }, [isLoadingNaverMap]);

  return (
    <NaverMapContext.Provider value={{ isLoading, naverMap }}>{children}</NaverMapContext.Provider>
  );
});

NaverMapProvider.displayName = 'NaverMapProvider';

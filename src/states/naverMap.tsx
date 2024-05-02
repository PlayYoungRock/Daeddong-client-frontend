import { useScript } from '@/hooks';
import { createContext, memo, useCallback, useEffect, useState } from 'react';

interface NaverMapProviderProps {
  children: React.ReactNode;
}

const NAVER_MAP_SDK_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`;

export const NaverMapContext = createContext<{
  isLoading: boolean | null;
  naverMap: naver.maps.Map | null;
  createNaverMap?: (map: naver.maps.Map) => void;
  deleteNaverMap?: () => void;
}>({ isLoading: null, naverMap: null });

export const NaverMapProvider = memo<NaverMapProviderProps>(({ children }) => {
  const [isLoadingNaverMap] = useScript({ src: NAVER_MAP_SDK_URL });
  const [isLoading, setIsLoading] = useState(true);
  const [naverMap, setNaverMap] = useState<naver.maps.Map | null>(null);
  const createNaverMap = useCallback((map: naver.maps.Map) => setNaverMap(map), []);
  const deleteNaverMap = useCallback(() => setNaverMap(null), []);

  useEffect(() => {
    if (!isLoadingNaverMap) {
      naver.maps.onJSContentLoaded = () => {
        setIsLoading(false);
      };
    }
  }, [isLoadingNaverMap]);

  return (
    <NaverMapContext.Provider value={{ isLoading, naverMap, createNaverMap, deleteNaverMap }}>
      {children}
    </NaverMapContext.Provider>
  );
});

NaverMapProvider.displayName = 'NaverMapProvider';

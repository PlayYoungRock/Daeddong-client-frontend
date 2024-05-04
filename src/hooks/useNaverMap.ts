import { ClientMapContext, NaverMapContext } from '@/states';
import { useContext, useEffect, useState } from 'react';

export const useNaverMap = () => {
  const { isLoading: isLoadingNaverMap, naverMap } = useContext(NaverMapContext);
  const [isLoadingClientMap, setIsLoadingClientMap] = useContext(ClientMapContext);
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  // context check
  useEffect(() => {
    if (isLoadingNaverMap === null) throw Error('NaverMapProvider를 선언해주세요.');
    if (setIsLoadingClientMap === null) throw Error('ClientMapProvider를 선언해주세요.');
  }, [isLoadingNaverMap, setIsLoadingClientMap]);

  useEffect(() => {
    if (isLoadingNaverMap || isLoadingClientMap) return;

    setMap(naverMap);
  }, [isLoadingClientMap, isLoadingNaverMap, naverMap]);

  return map;
};

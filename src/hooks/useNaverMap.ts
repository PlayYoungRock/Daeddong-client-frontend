import { NaverMapContext } from '@/states';
import { useContext, useEffect } from 'react';

export const useNaverMap = (mapDiv?: HTMLDivElement | null) => {
  const { isLoading, naverMap, createNaverMap, deleteNaverMap } = useContext(NaverMapContext);

  useEffect(() => {
    if (isLoading === null) throw Error('NaverMapProvider 선언 해주세요');
  }, [isLoading]);

  useEffect(() => {
    if (!mapDiv) return;
    if (createNaverMap && deleteNaverMap) {
      createNaverMap(new naver.maps.Map(mapDiv, { zoom: 17 }));

      return () => {
        deleteNaverMap;
      };
    }
  }, [createNaverMap, deleteNaverMap, mapDiv]);

  return { isLoading, map: naverMap };
};

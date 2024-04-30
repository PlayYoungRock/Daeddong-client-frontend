import { NaverMapContext } from '@/states';
import { useContext, useEffect, useMemo } from 'react';

export const useNaverMap = (mapDiv?: HTMLDivElement | null) => {
  const context = useContext(NaverMapContext);

  useEffect(() => {
    if (!context) throw Error('NaverMapProvider 선언 해주세요');
  }, [context]);

  useEffect(() => {
    if (!context || !mapDiv) return;
    context.naverMap.current = new naver.maps.Map(mapDiv, { zoom: 17 });

    return () => {
      context.naverMap.current = null;
    };
  }, [context, mapDiv]);

  const isLoading = useMemo(() => context?.isLoading ?? true, [context]);
  const map = useMemo(() => context?.naverMap.current ?? null, [context]);

  return { isLoading, map };
};

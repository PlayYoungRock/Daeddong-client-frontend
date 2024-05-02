import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useNaverMap } from './useNaverMap';
import { GetToiletListType, TOILET_LIST, ToiletType, getToiletList } from '@/utils';
import { useQuery } from '@tanstack/react-query';

interface CacheDataType {
  listener: naver.maps.MapEventListener[];
  marker: naver.maps.Marker[];
}

interface useToiletListType {
  onClick: (e: naver.maps.PointerEvent & ToiletType) => void;
}

export const useToiletList = ({ onClick }: useToiletListType) => {
  const { map } = useNaverMap();
  // 현재 위치 정보
  const [current, setCurrent] = useState<GetToiletListType | null>(null);
  const currentValue = useDebounce(current, 1000);
  const cachedList = useRef<ToiletType[]>([]);
  const cachedListenerList = useRef<naver.maps.MapEventListener[]>([]);
  const cachedMarkerList = useRef<naver.maps.Marker[]>([]);

  const { data: toiletList, isLoading } = useQuery({
    queryKey: [TOILET_LIST, currentValue],
    queryFn: () => (currentValue ? getToiletList(currentValue) : []),
    enabled: !!currentValue && !!map,
  });

  // current 초기화 및 변경
  useEffect(() => {
    if (!map) return;

    const listener = naver.maps.Event.addListener(map, 'bounds_changed', (bounds) => {
      const distance = new naver.maps.Polyline({
        path: [bounds.getNE(), map.getCenter()],
        map: map,
        visible: false,
      }).getDistance();
      setCurrent({ distance, latitude: map.getCenter().y, longitude: map.getCenter().x });
    });

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [map]);

  // naver map의 marker와 백엔드 api 데이터를 동기화
  useEffect(() => {
    if (isLoading || !toiletList || !map) return;

    // 제거, 유지, 생성 데이터를 구한다.
    const staleData = cachedList.current.reduce<CacheDataType>(
      (list, current, index) => {
        if (toiletList.every(({ seq }) => current.seq !== seq)) {
          list.listener.push(cachedListenerList.current[index]);
          list.marker.push(cachedMarkerList.current[index]);
        }

        return list;
      },
      { listener: [], marker: [] },
    );

    const freshData = toiletList.reduce<CacheDataType>(
      (list, current) => {
        if (cachedList.current.every(({ seq, ...toilet }) => current.seq !== seq)) {
          const marker = new naver.maps.Marker({
            position: { lat: current.latitude, lng: current.longitude },
            icon: '/map_toilet.svg',
            map: map,
          });
          const listener = naver.maps.Event.addListener(marker, 'rightclick', (e) => {
            onClick({ ...e, ...current });
          });

          list.marker.push(marker);
          list.listener.push(listener);
        }

        return list;
      },
      { listener: [], marker: [] },
    );

    const staticData = cachedList.current.reduce<CacheDataType>(
      (list, current, index) => {
        if (toiletList.some(({ seq }) => current.seq === seq)) {
          list.listener.push(cachedListenerList.current[index]);
          list.marker.push(cachedMarkerList.current[index]);
        }

        return list;
      },
      { listener: [], marker: [] },
    );

    // 제거, 유지, 생성 데이터를 통해 naver map과 cacheData를 업데이트해준다.
    staleData.marker.forEach((marker, i) => {
      marker.setMap(null);
      naver.maps.Event.removeListener(staleData.listener[i]);
    });

    cachedList.current = toiletList;
    cachedListenerList.current = [...freshData.listener, ...staticData.listener];
    cachedMarkerList.current = [...freshData.marker, ...staticData.marker];
  }, [isLoading, toiletList, map, onClick]);
};

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useNaverMap } from './useNaverMap';
import { GetToiletListType, TOILET_LIST, ToiletType, getToiletList } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { ClientMapContext } from '@/states';
import { markerUrl } from '@/constants';

interface CacheDataType {
  data: ToiletType;
  listener: naver.maps.MapEventListener;
  marker: naver.maps.Marker;
}

interface useToiletListType {
  onClick: (e: naver.maps.PointerEvent & ToiletType) => void;
}

export const useToiletList = ({ onClick }: useToiletListType) => {
  const map = useNaverMap();
  const [isLoadingClientMap] = useContext(ClientMapContext);
  // 현재 위치 정보
  const [current, setCurrent] = useState<GetToiletListType | null>(null);
  const currentValue = useDebounce(current, 300);

  const cacheData = useRef<Map<number, CacheDataType>>(new Map());

  const { data: toiletList, isLoading } = useQuery({
    queryKey: [TOILET_LIST, currentValue],
    queryFn: () => (currentValue ? getToiletList(currentValue) : []),
    enabled: !!currentValue && !!map && !isLoadingClientMap,
  });

  const handleOnSetCurrent = useCallback(
    (bounds: naver.maps.LatLngBounds) => {
      if (!map) return;

      const distance = new naver.maps.Polyline({
        path: [bounds.getNE(), map.getCenter()],
        map: map,
        visible: false,
      }).getDistance();
      setCurrent({ distance, latitude: map.getCenter().y, longitude: map.getCenter().x });
    },
    [map],
  );

  // current 초기화 및 변경
  useEffect(() => {
    if (!map) return;

    if (current === null) {
      handleOnSetCurrent(map.getBounds() as naver.maps.LatLngBounds);
      return;
    }

    const listener = naver.maps.Event.addListener(map, 'bounds_changed', (bounds) =>
      handleOnSetCurrent(bounds),
    );

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [map, current, handleOnSetCurrent]);

  // naver map의 marker와 백엔드 api 데이터를 동기화
  useEffect(() => {
    if (isLoading || !toiletList || !map) return;

    // stale data remove
    cacheData.current.forEach(({ data }) => {
      if (toiletList.some(({ seq }) => seq === data.seq)) return;

      const staleData = cacheData.current.get(data.seq);
      if (!staleData) return;

      const { listener, marker } = staleData;
      naver.maps.Event.removeListener(listener);
      marker.setMap(null);

      cacheData.current.delete(data.seq);
    });

    // fresh data add
    toiletList.forEach((data) => {
      if (cacheData.current.get(data.seq)) return;

      const marker = new naver.maps.Marker({
        position: { lat: data.latitude, lng: data.longitude },
        icon: markerUrl,
        map: map,
      });

      const listener = naver.maps.Event.addListener(marker, 'click', (e) => {
        onClick({ ...e, ...data });
      });

      cacheData.current.set(data.seq, { data, listener, marker });
    });
  }, [isLoading, toiletList, map, onClick]);
};

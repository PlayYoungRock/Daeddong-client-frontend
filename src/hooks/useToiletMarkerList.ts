import { MapContext } from '@/components';
import { useContext, useEffect } from 'react';

interface ToiletType {
  seq: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  si: string;
  gungu: string;
  floor: string | null;
  openTime: string;
  closeTime: string;
  regDt: string;
  modDt: string | null;
  manageAgency: string;
  maNum: string;
  toiletType: string;
  countMan: string;
  countWomen: string;
  babyYn: string;
  unusualYn: string;
  cctvYn: string;
  alarmYn: string;
  pwdYn: string;
  pwd: string;
  etc: string;
  regId: string;
  modId: string | null;
  openYn: string;
}

interface OptionsType {
  list: ToiletType[];
  onClick: (e: ToiletType | naver.maps.PointerEvent) => void;
}

export const useToiletMarkerList = (options?: OptionsType) => {
  const { isCreatedMap, map } = useContext(MapContext);

  useEffect(() => {
    const naverMap = map.current;
    if (!isCreatedMap) return;
    if (!naverMap) return;
    if (!options) return;
    const markers: naver.maps.Marker[] = [];
    const listeners: naver.maps.MapEventListener[] = [];

    options.list.forEach(({ latitude, longitude, ...toilet }) => {
      const marker = new naver.maps.Marker({
        position: { lat: latitude, lng: longitude },
        icon: '/map_toilet.svg',
        map: naverMap,
      });
      const listener = naver.maps.Event.addListener(marker, 'click', (e) => {
        options.onClick({ ...e, ...toilet, latitude, longitude });
      });

      markers.push(marker);
      listeners.push(listener);
    });

    return () => {
      options.list.forEach((_, i) => {
        markers[i].setMap(null);
        naver.maps.Event.removeListener(listeners[i]);
      });
    };
  }, [isCreatedMap, map, options]);
};

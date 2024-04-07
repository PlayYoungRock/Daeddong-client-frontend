import { MapContext } from '@/components';
import { useContext, useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

const isLatLngBounds = (
  bounds: naver.maps.PointBounds | naver.maps.LatLngBounds,
): bounds is naver.maps.LatLngBounds => {
  return bounds instanceof naver.maps.LatLngBounds;
};

export const useDistance = () => {
  const { status, map } = useContext(MapContext);
  const [distance, setDistance] = useState(0);
  const value = useDebounce(distance, 500);

  useEffect(() => {
    if (!status) return;
    if (!map.current) return;

    const current = map.current;
    const bounds = current.getBounds();

    if (!isLatLngBounds(bounds)) return;

    const maxDiagonal = new naver.maps.Polyline({
      path: [bounds.getNE(), current.getCenter()],
      map: current,
      visible: false,
    });
    setDistance(maxDiagonal.getDistance());

    const getDistance = naver.maps.Event.addListener(current, 'bounds_changed', (bounds) => {
      maxDiagonal.setPath([bounds.getNE(), current.getCenter()]);

      setDistance(maxDiagonal.getDistance());
    });

    return () => naver.maps.Event.removeListener(getDistance);
  }, [map, status]);

  return { distance: value };
};

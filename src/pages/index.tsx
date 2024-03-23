import { Map } from '@/components';
import { MapProvider } from '@/components/Map/MapProvider';

export default function Home() {
  return (
    <MapProvider>
      <Map />
    </MapProvider>
  );
}

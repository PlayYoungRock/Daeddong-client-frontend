import styled from 'styled-components';
import { Map, InfoSheet, MapContext, Text } from '@/components';
import { useContext, useState } from 'react';
import { useCenter, useCurrentMarker, useDistance, useToiletMarkerList } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { getToiletList } from '@/utils';

interface FormType {
  seq: number | null;
  latitude: number | null;
  longitude: number | null;
  name: string;
  address: string;
  etc: string;
}

interface FormType {
  seq: number | null;
  latitude: number | null;
  longitude: number | null;
  name: string;
  address: string;
  etc: string;
}

export default function Home() {
  const { isCreatedMap } = useContext(MapContext);
  const [form, setForm] = useState<FormType | null>(null);
  const { center } = useCenter();
  const { distance } = useDistance();

  const { data: toiletList } = useQuery({
    queryKey: [distance, center.lat, center.lng],
    queryFn: () => getToiletList({ distance, latitude: center.lat, longitude: center.lng }),
    enabled: !!distance && !!isCreatedMap,
    initialData: [],
  });

  useCurrentMarker({
    onVisible: (e) => {
      if (!isCreatedMap) return;
      const { coord } = e;

      naver.maps.Service.reverseGeocode(
        {
          coords: coord,
          orders: naver.maps.Service.OrderType.ROAD_ADDR,
        },
        (status, response) => {
          if (status === naver.maps.Service.Status.ERROR) return;

          setForm({
            seq: null,
            name: '',
            latitude: coord.x,
            longitude: coord.y,
            address: response.v2.address.roadAddress.replaceAll('  ', ' '),
            etc: '',
          });
        },
      );
    },
    onInVisible: () => setForm(null),
  });

  useToiletMarkerList({
    list: toiletList,
    onClick: (e) => {
      const { seq, name, latitude, longitude, address, etc } = e;

      setForm({
        seq,
        name,
        latitude,
        longitude,
        address,
        etc,
      });
    },
  });

  return (
    <Container>
      <Map />
      <InfoSheet>
        {form ? (
          <SheetWrapper>
            <FormWrapper>
              <Text $fontSize={20} $bold>
                {form.name}
              </Text>
              <Text $size="large">{form.address}</Text>
              <Text $size="large">{form.etc}</Text>
            </FormWrapper>
            {/* TODO CRUD api 작업이 완료되면 버튼 추가할것 */}
          </SheetWrapper>
        ) : (
          <Text $size="large">현재 위치를 지도에서 선택해주세요.</Text>
        )}
      </InfoSheet>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  overflow: hidden;

  @media (min-width: 760px) {
    display: flex;
    width: 760px;
    gap: 20px;
  }
`;

const SheetWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

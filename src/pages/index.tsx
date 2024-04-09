import styled from 'styled-components';
import { Map, InfoSheet, MapContext, Text } from '@/components';
import { useContext } from 'react';
import { useCenter, useCurrentMarker, useDistance, useToiletMarkerList } from '@/hooks';

export default function Home() {
  useContext(MapContext);
  const { center } = useCenter();
  const { distance } = useDistance();
  useCurrentMarker();
  useToiletMarkerList({
    list: [
      {
        seq: 47767,
        name: '수정동우체국 1층 화장실',
        latitude: 35.1273229,
        longitude: 129.0456475,
        address: '부산광역시 동구 수정로 9',
        si: '부산광역시',
        gungu: '동구',
        floor: null,
        openTime: '09:00~18:00 주말및공휴일 미개방',
        closeTime: '09:00~18:00 주말및공휴일 미개방',
        regDt: '2024-03-22 13:32:08',
        modDt: null,
        manageAgency: '수정동우체국',
        maNum: '051-468-2005',
        toiletType: '개방화장실',
        countMan: '0',
        countWomen: '1',
        babyYn: 'N',
        unusualYn: '1',
        cctvYn: 'N',
        alarmYn: 'N',
        pwdYn: 'N',
        pwd: '',
        etc: '',
        regId: 'jack',
        modId: null,
        openYn: 'Y',
      },
      {
        seq: 47824,
        name: '동구문화원 옥외 화장실',
        latitude: 35.1271294,
        longitude: 129.0460427,
        address: '부산광역시 동구 중앙대로349번길 20',
        si: '부산광역시',
        gungu: '동구',
        floor: null,
        openTime: '10:00~18:00 주말및공휴일 미개방',
        closeTime: '10:00~18:00 주말및공휴일 미개방',
        regDt: '2024-03-22 13:32:09',
        modDt: null,
        manageAgency: '동구문화원(문화관광과)',
        maNum: '051-440-4928',
        toiletType: '개방화장실',
        countMan: '1',
        countWomen: '3',
        babyYn: 'N',
        unusualYn: '1',
        cctvYn: 'N',
        alarmYn: 'N',
        pwdYn: 'N',
        pwd: '',
        etc: '',
        regId: 'jack',
        modId: null,
        openYn: 'Y',
      },
    ],
    onClick: (e) => {
      console.log(e);
    },
  });

  return (
    <Container>
      <Map />
      <InfoSheet>
        <Text>{distance.toFixed(2)}m</Text>
      </InfoSheet>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  overflow: hidden;

  @media (min-width: 760px) {
    display: flex;
    gap: 20px;
  }
`;

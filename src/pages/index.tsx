import styled from 'styled-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Map, InfoSheet, Text } from '@/components';
import { useToiletList, useNaverMap, useCurrentMarker } from '@/hooks';
import { SI_DO_LIST, SI_GUN_GU_LIST, ToiletType, getSiGunguList, getSidoList } from '@/utils';
import { NoneOption } from '@/constants';

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
  const map = useNaverMap();
  const [form, setForm] = useState<FormType | null>(null);

  useCurrentMarker({
    onVisible: ({ coord }) => {
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
  const handleOnClick = useCallback(
    ({ seq, name, latitude, longitude, address, etc }: ToiletType) =>
      setForm({
        seq,
        name,
        latitude,
        longitude,
        address,
        etc,
      }),
    [],
  );

  useToiletList({
    onClick: handleOnClick,
  });

  // 시군구 목록
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');

  const { data: _sidoOptions } = useQuery({
    queryKey: [SI_DO_LIST],
    queryFn: getSidoList,
    initialData: [],
  });

  const sidoOptions = useMemo(
    () => [NoneOption, ..._sidoOptions.map(({ si }) => ({ label: si, value: si }))],
    [_sidoOptions],
  );

  const { data: _sigunguOptions } = useQuery({
    queryKey: [SI_GUN_GU_LIST, sido],
    queryFn: () => getSiGunguList(sido),
    enabled: !!sido,
    gcTime: Infinity,
    initialData: [],
  });

  const sigunguOptions = useMemo(
    () => [NoneOption, ..._sigunguOptions.map(({ gungu }) => ({ label: gungu, value: gungu }))],
    [_sigunguOptions],
  );

  useEffect(() => {
    if (!map) return;

    if (sido && sigungu) {
      naver.maps.Service.geocode({ query: `${sido} ${sigungu}` }, (status, res) => {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert('네이버 검색 서버 오류');
        }

        if (res.v2.meta.totalCount === 0) {
          return alert('네이버 검색 결과 없음');
        }

        map.panTo(
          new naver.maps.LatLng(Number(res.v2.addresses[0].y), Number(res.v2.addresses[0].x)),
        );
      });
    }
  }, [map, sido, sigungu]);

  return (
    <Container>
      <Map />
      <InfoSheet>
        <SelectWrapper>
          <CustomSelect
            value={sido}
            onChange={(e) => {
              setSido(e.target.value);
              setSigungu('');
            }}
          >
            {sidoOptions.map(({ label, value }, i) => (
              <option key={`${value}-${i}`} value={value}>
                {label}
              </option>
            ))}
          </CustomSelect>
          <CustomSelect value={sigungu} onChange={(e) => setSigungu(e.target.value)}>
            {sigunguOptions.map(({ label, value }, i) => (
              <option key={`${value}-${i}`} value={value}>
                {label}
              </option>
            ))}
          </CustomSelect>
        </SelectWrapper>
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

const SelectWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 16px 0;

  @media (max-width: 760px) {
    position: absolute;
    padding: 0;
    top: -40px;
    left: 0;
    width: 100%;
  }
`;

const CustomSelect = styled.select`
  width: 100%;
  outline: none;
  height: 36px;
  padding: 8px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #222222;
`;

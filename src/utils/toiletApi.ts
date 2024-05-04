import { httpInstance } from './http';

export const TOILET_LIST = 'toiletList';
export const SI_DO_LIST = 'sidoList';
export const SI_GUN_GU_LIST = 'sigunguList';

type ResultCodeType = '0000' | '1001' | '8000' | '8001' | '9999';

export interface GetToiletListType {
  distance: number;
  latitude: number;
  longitude: number;
}

export interface ToiletType {
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
  maNum: string | null;
  toiletType: string;
  countMan: number;
  countWomen: number;
  babyYn: string;
  unusualYn: number;
  cctvYn: string;
  alarmYn: string;
  pwdYn: string;
  pwd: string;
  etc: string;
  regId: string;
  modId: string | null;
  openYn: string;
}

interface SidoType {
  si: string;
  gungu: string;
}

export const getToiletList = async (params: GetToiletListType) => {
  const { data } = await httpInstance.get<{ toiletList: ToiletType[]; resultCode: ResultCodeType }>(
    TOILET_LIST,
    { params: params },
  );

  if (data.resultCode === '8000' || data.resultCode === '8001') throw Error('토큰없음');

  return data.resultCode === '9999' ? [] : data.toiletList;
};

export const getSidoList = async () => {
  const { data } = await httpInstance.get<{ resultCode: ResultCodeType; sidoList: SidoType[] }>(
    `${SI_DO_LIST}`,
  );
  if (data.resultCode === '8000' || data.resultCode === '8001') throw Error('토큰없음');

  return data.sidoList;
};

export const getSiGunguList = async (sido: string) => {
  const { data } = await httpInstance.get<{ resultCode: ResultCodeType; sigunguList: SidoType[] }>(
    `${SI_GUN_GU_LIST}`,
    { params: { sido } },
  );

  if (data.resultCode === '8000' || data.resultCode === '8001') throw Error('토큰없음');

  return data.sigunguList;
};

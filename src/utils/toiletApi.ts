import { httpInstance } from './http';

export const TOILET_LIST = 'toiletList';

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

export const getToiletList = async (params: {
  distance: number;
  latitude: number;
  longitude: number;
}) => {
  const { data } = await httpInstance.get<{ toiletList: ToiletType[] }>(TOILET_LIST, {
    params: params,
  });

  return data.toiletList;
};

import { GEO_ERROR_UNSUPPORTED, GEO_ERROR_PERMISSION, GEO_ERROR_OTHERS } from '../constants';

export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type MapPhoto = {
  id: string;
  pos: Coordinates;
  addr: string;
  date: Date;
};

export type MapState = Coordinates & { zoom: number };

export type GeoError =
  | typeof GEO_ERROR_UNSUPPORTED
  | typeof GEO_ERROR_PERMISSION
  | typeof GEO_ERROR_OTHERS;

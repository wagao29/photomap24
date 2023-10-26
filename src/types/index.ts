import {
  GEO_ERROR_UNSUPPORTED,
  GEO_ERROR_OUT_OF_BOUNDS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_OTHERS,
  DIALOG_CONFIRM,
  DIALOG_DELETE,
  DIALOG_ERROR,
  DIALOG_CRITICAL,
  FETCH_ERROR_NOT_EXISTS,
  FETCH_ERROR_OTHERS
} from '../constants';

export type Coordinates = {
  longitude: number;
  latitude: number;
};

export type Photo = {
  id: string;
  pos: Coordinates;
  address: string;
  createdAt: Date;
  expireAt: Date;
  views: number;
};

export type MapPhoto = {
  id: string;
  pos: Coordinates;
  date: Date;
};

export type MapState = Coordinates & { zoom: number };

export type FetchError = typeof FETCH_ERROR_NOT_EXISTS | typeof FETCH_ERROR_OTHERS;

export type DialogType =
  | typeof DIALOG_CONFIRM
  | typeof DIALOG_DELETE
  | typeof DIALOG_ERROR
  | typeof DIALOG_CRITICAL;

export type GeoError =
  | typeof GEO_ERROR_UNSUPPORTED
  | typeof GEO_ERROR_OUT_OF_BOUNDS
  | typeof GEO_ERROR_PERMISSION
  | typeof GEO_ERROR_OTHERS;

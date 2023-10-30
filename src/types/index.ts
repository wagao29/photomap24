import {
  GEO_ERROR_UNSUPPORTED,
  GEO_ERROR_OUT_OF_BOUNDS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_OTHERS,
  DIALOG_CONFIRM,
  DIALOG_DELETE,
  DIALOG_ERROR,
  DIALOG_CRITICAL
} from '../constants';

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

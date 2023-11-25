import {
  GEO_ERROR_OTHERS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_UNSUPPORTED,
  GEO_SOURCE_CURRENT_LOCATION,
  GEO_SOURCE_EXIF_GEO_INFO
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

export type GeoSource = typeof GEO_SOURCE_CURRENT_LOCATION | typeof GEO_SOURCE_EXIF_GEO_INFO;

export type GeoError =
  | typeof GEO_ERROR_UNSUPPORTED
  | typeof GEO_ERROR_PERMISSION
  | typeof GEO_ERROR_OTHERS;

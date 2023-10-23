import {
  EAST_POINT,
  GEO_ERROR_OTHERS,
  GEO_ERROR_OUT_OF_BOUNDS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_UNSUPPORTED,
  GET_CURRENT_POSITION_TIME_OUT,
  NORTH_POINT,
  SOUTH_POINT,
  WEST_POINT
} from '../constants';
import { Coordinates, GeoError } from '../types';

export const getCurrentPosition = (): Promise<Coordinates | GeoError> => {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(GEO_ERROR_UNSUPPORTED);
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (
          longitude >= WEST_POINT &&
          longitude <= EAST_POINT &&
          latitude >= SOUTH_POINT &&
          latitude <= NORTH_POINT
        ) {
          resolve({ latitude, longitude });
        } else {
          resolve(GEO_ERROR_OUT_OF_BOUNDS);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          resolve(GEO_ERROR_PERMISSION);
        } else {
          resolve(GEO_ERROR_OTHERS);
        }
      },
      {
        timeout: GET_CURRENT_POSITION_TIME_OUT,
        enableHighAccuracy: true
      }
    );
  });
};

import {
  GEO_ERROR_OTHERS,
  GEO_ERROR_PERMISSION,
  GEO_ERROR_UNSUPPORTED,
  GET_CURRENT_POSITION_TIME_OUT
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
        resolve({ latitude, longitude });
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

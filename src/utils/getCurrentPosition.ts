import { GET_CURRENT_POSITION_TIME_OUT } from '../constants';
import { Coordinates } from '../types';

export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is unsupported'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({ latitude, longitude });
      },
      (err) => {
        reject(err);
      },
      {
        timeout: GET_CURRENT_POSITION_TIME_OUT,
        enableHighAccuracy: true
      }
    );
  });
};

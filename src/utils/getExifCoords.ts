import loadImage from 'blueimp-load-image';
import { Coordinates } from '../types';

export const getExifCoords = (file: File): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    loadImage.parseMetaData(file, (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gpsInfo = data?.exif?.get('GPSInfo') as any;
      if (gpsInfo) {
        const gpsLatitude = gpsInfo.get('GPSLatitude');
        const gpgLongitude = gpsInfo.get('GPSLongitude');
        if (gpsLatitude && gpgLongitude) {
          const latitude = gpsLatitude[0] / 1 + gpsLatitude[1] / 60 + gpsLatitude[2] / 3600;
          const longitude = gpgLongitude[0] / 1 + gpgLongitude[1] / 60 + gpgLongitude[2] / 3600;
          resolve({ latitude, longitude });
        } else {
          reject(new Error('Exif GPSLatitude or GPSLongitude does not exist'));
        }
      } else {
        reject(new Error('Exif GPSInfo does not exist'));
      }
    });
  });
};

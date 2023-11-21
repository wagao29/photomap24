import { collection, doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_VERSION, MAP_PHOTOS_DOCUMENT_ID } from '../constants';
import { db } from '../firebase';
import { MapPhoto } from '../types';
import { getRemainingTime } from '../utils/getRemainingTime';

export const fetchMapPhotos = async (): Promise<MapPhoto[]> => {
  console.debug('[API] fetchMapPhotos');

  try {
    const photoDocRef = doc(
      collection(db, `version/${FIRESTORE_VERSION}/mapPhotos`),
      MAP_PHOTOS_DOCUMENT_ID
    );
    const docSnap = await getDoc(photoDocRef);
    if (docSnap.exists()) {
      const mapPhotos: MapPhoto[] = docSnap
        .data()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .list.map((doc: any) => {
          if (
            doc?.id &&
            doc?.pos?.longitude &&
            doc?.pos?.latitude &&
            doc?.addr &&
            doc?.date?.toDate()
          ) {
            return {
              id: doc.id,
              pos: {
                longitude: doc.pos.longitude,
                latitude: doc.pos.latitude
              },
              addr: doc.addr,
              date: doc.date.toDate()
            } as MapPhoto;
          } else {
            return null;
          }
        })
        .filter(
          // Filter to not display expired photos
          (mapPhoto: MapPhoto | null) => !!mapPhoto && getRemainingTime(mapPhoto.date) > 0
        );
      return mapPhotos;
    }
    return [];
  } catch (error) {
    console.warn(error);
    return [];
  }
};

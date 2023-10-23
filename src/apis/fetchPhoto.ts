import { db } from '../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import { FetchError, Photo } from '../types';
import { FETCH_ERROR_NOT_EXISTS, FETCH_ERROR_OTHERS, FIRESTORE_VERSION } from '../constants';

export const fetchPhoto = async (id: string): Promise<Photo | FetchError> => {
  console.debug('[API] fetchPhoto');

  try {
    const photoDocRef = doc(collection(db, `version/${FIRESTORE_VERSION}/photos`), id);
    const docSnap = await getDoc(photoDocRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        pos: {
          longitude: docSnap.data().pos.longitude,
          latitude: docSnap.data().pos.latitude
        },
        address: docSnap.data().address,
        date: docSnap.data().date.toDate(),
        views: docSnap.data().views
      } as Photo;
    } else {
      return FETCH_ERROR_NOT_EXISTS;
    }
  } catch (error) {
    console.warn(error);
    return FETCH_ERROR_OTHERS;
  }
};

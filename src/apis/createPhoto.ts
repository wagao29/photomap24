import { collection, doc, GeoPoint, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { FIRESTORE_VERSION } from '../constants';
import { db, storage } from '../firebase';
import { Coordinates } from '../types';

export const createPhoto = async (
  photoFile: File,
  pos: Coordinates,
  address: string
): Promise<void> => {
  console.debug('[API] createPhoto');

  const photosCollectionRef = doc(collection(db, `version/${FIRESTORE_VERSION}/photos`));
  // TODO: png 以外も考慮
  const storagePhotoRef = ref(storage, `photos/${photosCollectionRef.id}.png`);

  await uploadBytes(storagePhotoRef, photoFile, { contentType: 'image/png' });

  await setDoc(photosCollectionRef, {
    pos: new GeoPoint(pos.latitude, pos.longitude),
    address: address,
    date: serverTimestamp(),
    views: 0
  });
};

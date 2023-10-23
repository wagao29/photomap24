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
  const storagePhotoRef = ref(storage, `photos/${photosCollectionRef.id}.jpg`);

  await uploadBytes(storagePhotoRef, photoFile, { contentType: 'image/jpeg' });

  await setDoc(photosCollectionRef, {
    pos: new GeoPoint(pos.latitude, pos.longitude),
    address: address,
    date: serverTimestamp(),
    views: 0
  });
};

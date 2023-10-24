import { collection, doc, GeoPoint, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { FIRESTORE_VERSION } from '../constants';
import { db, storage } from '../firebase';
import { Coordinates } from '../types';

export const createPhoto = async (
  photoFile: File,
  thumbnailBlob: Blob,
  pos: Coordinates,
  address: string
): Promise<void> => {
  console.debug('[API] createPhoto');

  const photosCollectionRef = doc(collection(db, `version/${FIRESTORE_VERSION}/photos`));
  const storagePhotoRef = ref(storage, `photos/${photosCollectionRef.id}.jpg`);
  const storageThumbnailRef = ref(storage, `thumbnails/${photosCollectionRef.id}.jpg`);

  await Promise.all([
    uploadBytes(storagePhotoRef, photoFile, { contentType: 'image/jpeg' }),
    uploadBytes(storageThumbnailRef, thumbnailBlob, { contentType: 'image/jpeg' })
  ]);

  await setDoc(photosCollectionRef, {
    pos: new GeoPoint(pos.latitude, pos.longitude),
    address: address,
    date: serverTimestamp(),
    views: 0
  });
};

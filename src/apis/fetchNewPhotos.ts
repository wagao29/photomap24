import { db } from '../firebase';
import { collection, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { FIRESTORE_VERSION } from '../constants';
import { Photo } from '../types';
import { getRemainingTime } from '../utils/getRemainingTime';

export const fetchNewPhotos = async (lastDate: Date, fetchLength: number): Promise<Photo[]> => {
  console.debug('[API] fetchNewPhotos');

  try {
    lastDate.setMilliseconds(lastDate.getMilliseconds() - 1);
    const photosCollectionRef = collection(db, `version/${FIRESTORE_VERSION}/photos`);
    const q = query(
      photosCollectionRef,
      orderBy('createdAt', 'desc'),
      startAt(lastDate),
      limit(fetchLength)
    );
    const querySnapshot = await getDocs(q);
    const result = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        return {
          id: doc.id,
          pos: {
            longitude: doc.data().pos.longitude,
            latitude: doc.data().pos.latitude
          },
          address: doc.data().address,
          createdAt: doc.data().createdAt.toDate()
        } as Photo;
      })
    );
    const photos = result.filter(
      // expired の photo は表示しないようフィルタリング
      (photo: Photo) => !!photo && getRemainingTime(photo.createdAt) > 0
    );
    return photos;
  } catch (error) {
    console.warn(error);
    return [];
  }
};

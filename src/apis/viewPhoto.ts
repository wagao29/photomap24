import { doc, increment, updateDoc } from 'firebase/firestore';
import { FIRESTORE_VERSION } from '../constants';
import { db } from '../firebase';

export const viewPhoto = async (id: string): Promise<void> => {
  console.debug('[API] viewPhoto');

  try {
    const photoRef = doc(db, `version/${FIRESTORE_VERSION}/photos`, id);
    await updateDoc(photoRef, {
      views: increment(1)
    });
  } catch (error) {
    console.warn(error);
  }
};

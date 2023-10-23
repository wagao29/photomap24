import { storage } from '../firebase';

export const getPhotoUrl = (id: string): string => {
  return `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/photos%2F${id}.jpg?alt=media`;
};

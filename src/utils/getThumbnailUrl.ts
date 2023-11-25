import { storage } from '../firebase';

export const getThumbnailUrl = (id: string): string => {
  return `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/thumbnails%2F${id}.jpg?alt=media`;
};

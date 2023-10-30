import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const FIRESTORE_VERSION = 1;
const MAP_PHOTOS_DOCUMENT_ID = 1;

export const onDeletePhoto = functions
  .region('asia-northeast1')
  .firestore.document(`version/${FIRESTORE_VERSION}/photos/{id}`)
  .onDelete(async (snap) => {
    const photoId = snap.id;
    const photoDoc = snap.data();

    // mapPhotosから削除
    const updatedDocData = {
      list: admin.firestore.FieldValue.arrayRemove({
        id: photoId,
        pos: photoDoc.pos,
        addr: photoDoc.addr,
        date: photoDoc.createdAt
      })
    };
    const mapPhotosDocRef = admin
      .firestore()
      .doc(`version/${FIRESTORE_VERSION}/mapPhotos/${MAP_PHOTOS_DOCUMENT_ID}`);
    await mapPhotosDocRef.set(updatedDocData, { merge: true });

    // 画像を削除
    const bucket = admin.storage().bucket();
    const photoPath = `photos/${photoId}.jpg`;
    const thumbnailPath = `thumbnails/${photoId}.jpg`;
    await Promise.all([bucket.file(photoPath).delete(), bucket.file(thumbnailPath).delete()]);
  });

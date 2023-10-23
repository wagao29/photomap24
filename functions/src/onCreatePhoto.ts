import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const FIRESTORE_VERSION = 1;
const MAP_PHOTOS_DOCUMENT_ID = 1;

export const onCreatePhoto = functions
  .region('asia-northeast1')
  .firestore.document(`version/${FIRESTORE_VERSION}/photos/{id}`)
  .onCreate(async (snap) => {
    const photoId = snap.id;
    const photoDoc = snap.data();

    // mapPhotosに追加
    const updatedDocData = {
      list: admin.firestore.FieldValue.arrayUnion({
        id: photoId,
        pos: photoDoc.pos,
        date: photoDoc.date
      })
    };
    const mapPhotosDocRef = admin
      .firestore()
      .doc(`version/${FIRESTORE_VERSION}/mapPhotos/${MAP_PHOTOS_DOCUMENT_ID}`);
    await mapPhotosDocRef.set(updatedDocData, { merge: true });
  });

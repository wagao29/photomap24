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

    // photo ドキュメントに expireAt を追加
    const expireAt = new Date(photoDoc.createdAt.toDate().getTime() + 24 * 60 * 60 * 1000); // 24時間後
    const photoDocRef = admin.firestore().doc(`version/${FIRESTORE_VERSION}/photos/${photoId}`);
    await photoDocRef.set({ expireAt }, { merge: true });

    // mapPhotos に追加
    const updatedDocData = {
      list: admin.firestore.FieldValue.arrayUnion({
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
  });

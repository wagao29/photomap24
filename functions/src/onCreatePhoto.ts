import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const FIRESTORE_VERSION = 1;
const MAP_PHOTOS_DOCUMENT_ID = 1;
const MAX_EVENT_AGE_MS = 10 * 60 * 1000;
const EXPIRE_TIME_MS = 24 * 60 * 60 * 1000;

export const onCreatePhoto = functions
  .region('asia-northeast1')
  .runWith({ failurePolicy: true })
  .firestore.document(`version/${FIRESTORE_VERSION}/photos/{id}`)
  .onCreate(async (snap, context) => {
    // Check retry limit
    const eventAgeMs = Date.now() - Date.parse(context.timestamp);
    if (eventAgeMs > MAX_EVENT_AGE_MS) {
      console.log(`Dropping event ${context.eventId} with age[ms]: ${eventAgeMs}`);
      return;
    }

    const photoId = snap.id;
    const photoDoc = snap.data();

    // Add expireAt to photo doc
    const expireAt = new Date(photoDoc.createdAt.toDate().getTime() + EXPIRE_TIME_MS);
    const photoDocRef = admin.firestore().doc(`version/${FIRESTORE_VERSION}/photos/${photoId}`);
    await photoDocRef.set({ expireAt }, { merge: true });

    // Add to mapPhotos
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

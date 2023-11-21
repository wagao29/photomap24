import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const FIRESTORE_VERSION = 1;
const MAP_PHOTOS_DOCUMENT_ID = 1;
const MAX_EVENT_AGE_MS = 10 * 60 * 1000;

export const onDeletePhoto = functions
  .region('asia-northeast1')
  .runWith({ failurePolicy: true })
  .firestore.document(`version/${FIRESTORE_VERSION}/photos/{id}`)
  .onDelete(async (snap, context) => {
    // Check retry limit
    const eventAgeMs = Date.now() - Date.parse(context.timestamp);
    if (eventAgeMs > MAX_EVENT_AGE_MS) {
      console.log(`Dropping event ${context.eventId} with age[ms]: ${eventAgeMs}`);
      return;
    }

    const photoId = snap.id;
    const photoDoc = snap.data();

    // Remove from mapPhotos
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

    // Delete image files
    const bucket = admin.storage().bucket();
    const photoPath = `photos/${photoId}.jpg`;
    const thumbnailPath = `thumbnails/${photoId}.jpg`;
    await Promise.all([bucket.file(photoPath).delete(), bucket.file(thumbnailPath).delete()]);
  });

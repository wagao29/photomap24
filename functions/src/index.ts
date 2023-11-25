import * as admin from 'firebase-admin';
import { onCreatePhoto } from './onCreatePhoto';
import { onDeletePhoto } from './onDeletePhoto';

admin.initializeApp();

exports.onCreatePhoto = onCreatePhoto;
exports.onDeletePhoto = onDeletePhoto;

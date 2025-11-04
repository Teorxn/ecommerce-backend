import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!),
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
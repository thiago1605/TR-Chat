import admin, {
  initializeApp,
  apps,
  credential,
  firestore,
} from "firebase-admin";

if (!apps.length) {
  initializeApp({
    credential: credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: `${process.env.FIREBASE_PRIVATE_KEY}`.replace(/\\n/g, "\n"),
    }),

    databaseURL: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

  firestore().settings({
    ignoreUndefinedProperties: true,
  });
}

export default admin;

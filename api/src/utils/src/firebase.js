import * as admin from "firebase-admin";

import serviceAccountGen from "./serviceAccountGen";

const fireabse = serviceAccountGen();

admin.initializeApp({
  credential: admin.credential.cert(fireabse),
  databaseURL: `https://${fireabse.project_id}.firebaseio.com`
});

export default admin;

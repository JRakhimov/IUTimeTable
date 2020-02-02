import * as admin from "firebase-admin";

import serviceAccountGen from "./serviceAccountGen";
import { firebase } from "../index";
const fireabse = serviceAccountGen();

admin.initializeApp({
  credential: admin.credential.cert(fireabse),
  databaseURL: `https://${fireabse.project_id}.firebaseio.com`
});

// admin.database().ref("friends").once("value").then(x => x.val()).then(async friends => {
//   const sortedFriends = JSON.parse(JSON.stringify(friends));
//
//   for (const keyOne in sortedFriends) {
//     for (const keyTwo in sortedFriends[keyOne]) {
//       const isSOL = keyTwo[4] == 1;
//
//       const student = await admin.database().ref(`students/${isSOL ? "SOL" : "SOCIE"}/${keyTwo}`).once("value").then(x => x.val());
//
//       if (student != null) {
//         console.log(`friends/${keyOne}/${keyTwo}`);
//
//         await firebase
//           .database()
//           .ref(`friends/${keyOne}/${keyTwo}`)
//           .update({ groupName: student.groupName });
//       } else {
//         console.log(`error: friends/${keyOne}/${keyTwo}`);
//       }
//
//     }
//   }
//
//   admin.database().ref("students/SOCIE").set(sorted).then(() => console.log("Done"));
// });

// admin.database().ref("sessions").once("value").then(x => x.val()).then(sessions => {
// const sorted = JSON.parse(JSON.stringify(sessions));
//
// for (const keyOne in sorted) {
//   delete sorted[keyOne][keyOne].jwt;
//   console.log("L15 sorted[keyOne]:", sorted[keyOne][keyOne].jwt);
// }
//
// admin.database().ref("sessions").set(sorted);
// });

export default admin;

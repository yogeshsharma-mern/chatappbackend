// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// module.exports = admin;


import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

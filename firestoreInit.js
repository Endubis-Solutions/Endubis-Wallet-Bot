/* eslint-disable node/no-missing-require */
const firestoreSession = require("telegraf-session-firestore");

const { initializeApp } = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();
const sessionDocName = process.env.sessionDocName || "sessionsSecure";
const getSessionKey = (ctx) =>
  ctx.from && ctx.chat
    ? `${ctx.from.id}-${ctx.chat.id}`
    : ctx.from
    ? `${ctx.from.id}-${ctx.from.id}`
    : undefined;
const userIdFromSessionKey = (sessionKey) => sessionKey.split("-")[0];
const firestoreMiddleware = (collectionName) =>
  firestoreSession(db.collection(collectionName));
const firestoreLazyMiddleware = (collectionName) =>
  firestoreSession(db.collection(collectionName), {
    lazy: true,
    getSessionKey,
  });
const firestoreMiddlewareFn = firestoreMiddleware(sessionDocName);
const firestoreLazyMiddlewareFn = firestoreLazyMiddleware(sessionDocName);

module.exports = {
  db,
  firestoreMiddlewareFn,
  firestoreLazyMiddlewareFn,
  getSessionKey,
  userIdFromSessionKey,
  sessionDocName,
};

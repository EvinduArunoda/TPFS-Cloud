const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const DBUtil = require('../util/db_util');
// admin.initializeApp();
// const CA = require('./CriminalHistory/CA.js');
// const issueTicket =  require('./DigitalTicket/issueTicket');
const validateTicket = require('./ValidateTicket/validateTicket');
// exports.issueTicket = functions.https.onCall(issueTicket.handler);

exports.validateTicket = functions.https.onCall(validateTicket.handler);

// exports.CA = functions.https.onCall(CA.handler);

// exports.mobileNotification = functions.firestore.document('Notification/{NotificationId}').onCreate(async (snapshot,context) => {
//     var msgData = snapshot.data();
//     var payload = {
//         'notification': {
//             'title': msgData.title,
//             'body' : msgData.description,
//             'sound' : "default",
//             'click_action' : 'FLUTTER_NOTIFICATION_CLICK'
//         },
//         "data": {
//             "sendername" : msgData.title,
//             "message" : msgData.description,
//             'click_action' : 'FLUTTER_NOTIFICATION_CLICK'
//         }
//     }
//     return admin.messaging().sendToTopic('puppies',payload);
// })

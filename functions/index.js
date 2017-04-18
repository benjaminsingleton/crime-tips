const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp(functions.config().firebase);

// Keeps track of the number of unreadTips
exports.countUnreadTips = functions.database.ref('/tips/{tipID}/read').onWrite(event => {

  const countRef = admin.database().ref('metrics/unreadTips');
  if (!event.data.previous.exists()) {
    // if tip was just created, increase current unread count by 1
    console.log('tip never existed before so +1')
    return countRef.transaction(current => current + 1);
  } else if (event.data.previous.val() === false && event.data.val() === true) {
    // if tip was just read the first time, decrease current unread count + 1
    console.log('tip was just read the first time so -1')
    return countRef.transaction(current => current - 1);
  }
});

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendNewTipNotification = functions.database.ref('/tips/{tipId}').onWrite(event => {
  console.log('started sending new tip function!')

  // Only send email if tip was just created
  if (!event.data.previous.exists()) {
    console.log('new tip created!!')

    // Create array of all users that have subscribed to new tip notifications
    const users = admin.database().ref('users')
    const usersToReceiveNotificationsKeys = Object.keys(users).filter(key => users[key].notifications === true)
    const mailRecipients = usersToReceiveNotificationsKeys.map(key => users[key].email)
    console.log(mailRecipients)

    const mailOptions = {
      from: '"Crime Tips 24/7" <noreply@crimetips247.com>',
      to: "benjaminsingleton@mac.com" // replace with mailRecipients
    };

    mailOptions.subject = 'New Crime Tip!';
    mailOptions.text = 'We received a new tip!';
    return mailTransport.sendMail(mailOptions).then(() => {
        console.log('Crime tip email sent.');
    });
  };
});
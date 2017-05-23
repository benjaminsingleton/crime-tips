import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCB8vezVYwIrQ1rvUvui4EuMl52SDUTlwE',
  authDomain: 'crimetips-c7b87.firebaseapp.com',
  databaseURL: 'https://crimetips-c7b87.firebaseio.com',
  storageBucket: 'crimetips-c7b87.appspot.com',
};

const firebaseApp = firebase.initializeApp(config);

export function incrementUnreadAbandonedTipsCount() {
  firebaseApp.database().ref('metrics/unreadAbandonedTips')
    .transaction(currentValue => currentValue + 1);
  return null;
}

export { firebaseApp };

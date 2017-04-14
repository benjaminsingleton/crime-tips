import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyCB8vezVYwIrQ1rvUvui4EuMl52SDUTlwE",
  authDomain: "crimetips-c7b87.firebaseapp.com",
  databaseURL: "https://crimetips-c7b87.firebaseio.com",
}

firebase.initializeApp(config)

export const databaseRef = firebase.database().ref()
export const firebaseAuth = firebase.auth
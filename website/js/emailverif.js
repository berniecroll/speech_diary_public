import { send_email_verification } from "./modules/auth.js";

if (window.location.pathname == "/emailverif") {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        send_email_verification(user)
      } else {
        window.location.pathname = '/index'
      }
    });
}

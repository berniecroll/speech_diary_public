import { 
    login_user
} from "./modules/auth.js"

/* 
    These are the pages that do not need authentication to access however
    we want to trigger the post login processes if a user is already
    logged in.

    If a person is not logged in and the page isn't restricted to
    authenticated users, then the pre-login/signup processes are
    triggered for the users to see.
*/
const PAGES_TO_CHECK_ACCESS = ['/','/index','/about','/emailverif','/contact']

function main() {

  if (PAGES_TO_CHECK_ACCESS.includes(window.location.pathname)) {
    login_user()

  }
}



main()
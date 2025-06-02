
import { firebase_setup } from "./firebase_setup.js";
import { create_n_set_text, create_set_append, remove_children} from "./utilities.js";
import { check_log_in } from "../navigation.js"

const PAGES_AUTH_NOT_NEEDED = ['/','/index','/about','/contact']
/* ensure that below does not include '/emailverif' otherwise an infinite
   loop will occur */
const PAGES_EMAIL_VERIF_NEEDED = ['/dashboard']
var db = firebase_setup()

// functions
// function login_initial_checks(user)
// function set_input_error(modal_id, input_name, err_message)
// function set_input_success(modal_id, input_name)
// function set_input_remove(modal_id, input_array)
// function toggle_modal(modal)
// function signup(email, password, name) 
// function login(email, password)
// function signup_button()
// function login_button()
// function signup_form_check()
// function login_form_check(email, password)
// function signup_form_submit()
// function login_form_submit()
// function handle_form_click(form, modal, event)
// function email_verif_button(content, user)
// function send_email_verification(user)
// function setup_pre_login()
// function setup_post_login(username)
// function login_user()


function login_initial_checks(user) {
  if (user.emailVerified == false & PAGES_EMAIL_VERIF_NEEDED.includes(window.location.pathname)) {
    window.location.pathname = '/emailverif'
  }
}


function set_input_error(modal_id, input_name, err_message) {
  var modal = document.getElementById(modal_id)
  var inputs = modal.getElementsByTagName('input')
  var icons = modal.getElementsByTagName('i')
  var helpers = modal.getElementsByTagName('p')

  inputs[input_name].classList.add('is-danger')
  icons[input_name].classList.add('fa-exclamation-triangle')
  helpers[input_name].innerText = err_message
  helpers[input_name].classList.add('is-danger')
}

function set_input_success(modal_id, input_name) {
  var modal = document.getElementById(modal_id)
  var inputs = modal.getElementsByTagName('input')
  var icons = modal.getElementsByTagName('i')
  var helpers = modal.getElementsByTagName('p')

  inputs[input_name].classList.remove('is-danger')
  icons[input_name].classList.remove('fa-exclamation-triangle')
  
  inputs[input_name].classList.add('is-success')
  icons[input_name].classList.add('fa-check')
  helpers[input_name].innerText = ''
}

function set_input_remove(modal_id, input_array) {
  var modal = document.getElementById(modal_id)
  var inputs = modal.getElementsByTagName('input')
  var icons = modal.getElementsByTagName('i')
  var helpers = modal.getElementsByTagName('p')
  for (var input_name in input_array) {
    inputs[input_name].classList.remove('is-success', 'is-danger')
    icons[input_name].classList.remove('fa-check', 'fa-exclamation-triangle')
    helpers[input_name].innerText = ''
  }
  modal.getElementsByTagName('button')['btn-submit'].classList.remove('is-loading')

}

function toggle_modal(modal) {
  modal.classList.toggle('is-active')
}

// sign up event
function signup(email, password, name) {
  var modal = document.getElementById('sign-up-modal')
  modal.getElementsByTagName('button')['btn-submit'].classList.add('is-loading')

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;

    // set user name
    user.updateProfile({
      displayName: name,
    }).then(() => {
      console.log('username uploaded')
    }).catch((error) => {
      console.log(error)
    }).finally(() => {
      set_input_success('sign-up-modal','name')
      set_input_success('sign-up-modal','email')
      set_input_success('sign-up-modal','pass')
      set_input_success('sign-up-modal','confirm-pass')
      window.location.pathname = "/emailverif"
    });  

    
  })
  .catch((error) => {

    if (error.code == 'auth/weak-password') {
      set_input_error('sign-up-modal', 'pass', error.message)
    }
    
    if (error.code == 'auth/invalid-email' || error.code == 'auth/email-already-in-use') {
      set_input_error('sign-up-modal', 'email', error.message)
    }

  })
  .finally(() => {
    modal.getElementsByTagName('button')['btn-submit'].classList.remove('is-loading')
  });
}

function login(email, password) {

  var modal = document.getElementById('log-in-modal')
  modal.getElementsByTagName('button')['btn-submit'].classList.add('is-loading')

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    set_input_success('log-in-modal','email')
    set_input_success('log-in-modal','pass')
    
    if (!user.emailVerified) {
      window.location.pathname = "/emailverif"
    } else {
      window.location.pathname = "/dashboard"
    }
  })
  .catch((error) => {

    if (error.code == 'auth/wrong-password') {
      set_input_error('log-in-modal', 'pass', error.message)
    }
    
    if (error.code == 'auth/invalid-email' || error.code == 'auth/user-disabled' ||
        error.code == 'auth/user-not-found') {
      set_input_error('log-in-modal', 'email', error.message)
    }

  })
  .finally(() => {
    modal.getElementsByTagName('button')['btn-submit'].classList.remove('is-loading')
  });
    
}

function signup_button() {
  var button = document.getElementById('sign-up')
  var modal = document.getElementById('sign-up-modal')
  var close_modal = modal.getElementsByClassName('modal-close')[0]
  var modal_background = modal.getElementsByClassName('modal-background')[0]
  var form = document.getElementById('signup-form')

  button.addEventListener("click",()=>{
    form.reset()
    set_input_remove('sign-up-modal', ['name','email','pass','confirm-pass'])
  })
  button.addEventListener("click", () => {toggle_modal(modal)})
  close_modal.addEventListener("click", () => {toggle_modal(modal)})
  modal_background.addEventListener("click", () => {toggle_modal(modal)})
}

function login_button() {
  var button = document.getElementById('log-in')
  var modal = document.getElementById('log-in-modal')
  var close_modal = modal.getElementsByClassName('modal-close')[0]
  var modal_background = modal.getElementsByClassName('modal-background')[0]
  var form = document.getElementById('login-form')

  button.addEventListener("click",()=>{
    form.reset()
    set_input_remove('log-in-modal', ['email','pass'])
  })
  button.addEventListener("click", () => {toggle_modal(modal)})
  close_modal.addEventListener("click", () => {toggle_modal(modal)})
  modal_background.addEventListener("click", () => {toggle_modal(modal)})
}

function signup_form_check() {
  var form = document.getElementById('signup-form').elements
    // name is letters only
    var username = form['name'].value
    const regex = new RegExp('^[a-zA-Z0-9]*$')
    var flag_one = false
    var flag_two = false
      // error on help and place as danger
    if (!regex.test(username)) {
      set_input_error('sign-up-modal', 'name','Letters and numbers can only be used.')
    } else if (username.length == 0) {
      set_input_error('sign-up-modal', 'name','Username must be specified.')
    } else if (username.length > 20) {
      set_input_error('sign-up-modal', 'name','Username must be less than 20 characters.')
    } else {
      set_input_success('sign-up-modal','name')
      flag_one = true
    }

    var pass_one = form['pass'].value
    var pass_two = form['confirm-pass'].value
    if (pass_one != pass_two) {
      set_input_error('sign-up-modal', 'pass','Passwords do not match.')
      set_input_error('sign-up-modal', 'confirm-pass','Passwords do not match.')
    } else {
      set_input_success('sign-up-modal','pass')
      set_input_success('sign-up-modal','confirm-pass')
      flag_two = true
    }

    if (flag_one == true && flag_two == true) {
      return true
    } else {
      return false
    }
}

function login_form_check(email, password) {
  var flag_one = false
  var flag_two = false
  if (email.length == 0) {
    set_input_error('log-in-modal', 'email','Email field cannot be empty.')
  } else {
    flag_one = true
  }
  if (password.length == 0) {
    set_input_error('log-in-modal', 'pass','Password field cannot be empty.')
  } else {
    flag_two = true
  }
  if (flag_one == true && flag_two == true) {
    return true
  } else {
    return false
  }
}

function signup_form_submit() {
  var form = document.getElementById('signup-form')
  var modal = document.getElementById('sign-up-modal')
  var submit = document.getElementById('btn-submit-signup')
  var cancel = document.getElementById('btn-cancel-signup')
  form.addEventListener('submit', (event) => {
    event.preventDefault() // stop refreshing page
    submit.click() // submits on enter key
  })
  submit.addEventListener('click', (event) => {
    event.preventDefault() // stop firing submit event
    handle_form_click(form, modal, event)
    console.log('test handle form')
  })
  cancel.addEventListener('click', (event) => {
    event.preventDefault() // stop firing submit event
    handle_form_click(form, modal, event)
  })
}

function login_form_submit() {
  var form = document.getElementById('login-form')
  var modal = document.getElementById('log-in-modal')
  var submit = document.getElementById('btn-submit-login')
  var cancel = document.getElementById('btn-cancel-login')
  form.addEventListener('submit', (event) => {
    event.preventDefault() // stop refreshing page
    submit.click() // submits on enter key
  })
  submit.addEventListener('click', (event) => {
    event.preventDefault() // stop firing submit event
    handle_form_click(form, modal, event)
  })
  cancel.addEventListener('click', (event) => {
    event.preventDefault() // stop firing submit event
    handle_form_click(form, modal, event)
  })
}

function handle_form_click(form, modal, event) {

  // cancel btns
  if (event.target.name == 'btn-cancel') {
    toggle_modal(modal)
  } else {

    // login
    if (event.target.id == 'btn-submit-login') {
      form = document.getElementById('login-form').elements
      var email = form['email'].value
      var password = form['pass'].value
      set_input_remove('log-in-modal', ['email','pass'])
      // clent side check
      if(login_form_check(email, password)) {
        login(email, password)
      }
    
    // signup
    } else if (event.target.id == 'btn-submit-signup') {
      form = document.getElementById('signup-form').elements
      var email = form['email'].value
      var password = form['pass'].value
      var name = form['name'].value
      set_input_remove('sign-up-modal', ['name','email','pass','confirm-pass'])
      // clent side check
      if(signup_form_check()) {
        signup(email, password, name)
      }
    } else {
      console.log('Error button target not found')
    }
  }
}

function email_verif_button(content, user) {
  // reloads user to check for email verif before
  // sending another verif email
    user.reload().then(() => {
      var user = firebase.auth().currentUser
      
      if (user.emailVerified) {
        while (content.firstChild) {
          content.firstChild.remove()
        }
        content.appendChild(create_n_set_text('h1',
        'Your email has already been verified.'))
        var button = create_n_set_text('button',
        'Back to home page')
        button.classList.add('button','is-primary')
        button.addEventListener('click', () => {window.location.pathname = "/index"})
        content.removeChild(document.getElementById('btn-loading'))
        content.appendChild(button)

      } else {
        while (content.firstChild) {
          content.firstChild.remove()
        }
        var load = document.createElement('button')
        load.classList.add('button','is-large', 'is-loading')
        load.setAttribute('id','btn-loading')
        content.appendChild(load)
        send_email_verification(user)
      }

    }).catch(() => {
      var user = firebase.auth().currentUser
    
      while (content.firstChild) {
        content.firstChild.remove()
      }
      var load = document.createElement('button')
      load.classList.add('button','is-large', 'is-loading')
      load.setAttribute('id','btn-loading')
      content.appendChild(load)
      send_email_verification(user)
    })

}

function send_email_verification(user) {
  var content = document.getElementById('content')

  if (user.emailVerified) {

    content.appendChild(create_n_set_text('h1',
    'Your email has already been verified.'))
    var button = create_n_set_text('button',
    'Back to home page')
    button.classList.add('button','is-primary')
    button.addEventListener('click', () => {window.location.pathname = "/index"})
    content.removeChild(document.getElementById('btn-loading'))
    content.appendChild(button)

  } else {

    user.sendEmailVerification()
    .then(() => {
  
      content.appendChild(create_n_set_text('h1',
      'Verification email sent!'))
      content.appendChild(create_n_set_text('p',
      'Please check your inbox and follow the prompts to verify your email address.'))
      var button = create_n_set_text('button',
      'Resend Verification Email')
      button.classList.add('button','is-primary')
      button.setAttribute('id','btn-veri')
      button.addEventListener('click', () => {email_verif_button(content, user)})
      content.removeChild(document.getElementById('btn-loading'))
      content.appendChild(button)
   
    }).catch((error) => {
  
      content.appendChild(create_n_set_text('h1',
      'Oops something went wrong!'))
      
      if (error.code == "auth/too-many-requests") {
        content.appendChild(create_n_set_text('p',
        'Too many requests for email verification have been received and consequently this device has been temporarily blocked.'))
      } else {
        content.appendChild(create_n_set_text('p',
        "We tried to send you an email verification email but it didn't work."))
      }
      content.appendChild(create_n_set_text('p',
      'Please try again later and refresh the page.'))
      var button = create_n_set_text('button',
      'Send Verification Email')
      button.classList.add('button','is-primary')
      button.setAttribute('id','btn-veri')
      button.addEventListener('click', () => {email_verif_button(content, user)})
      content.removeChild(document.getElementById('btn-loading'))
      content.appendChild(button)
    })

  }
}

// log in

function setup_pre_login() {
  var nav_buttons = document.getElementById('nav_btns')

  var modal_signup = document.getElementById('sign-up-modal')
  var form_signup = document.getElementById('signup-form')
  var modal_login = document.getElementById('log-in-modal')
  var form_login = document.getElementById('login-form')

  while (nav_buttons.firstChild) {
    nav_buttons.firstChild.remove()
  }

  var btn_signup = document.createElement('a')
  btn_signup.classList.add('button', 'is-primary')
  btn_signup.setAttribute('id','sign-up')
  var name_inner = document.createElement('strong')
  name_inner.innerText = 'Sign up'
  btn_signup.appendChild(name_inner)
  btn_signup.addEventListener('click', () => {
    form_signup.reset()
    set_input_remove('sign-up-modal', ['name','email','pass','confirm-pass'])
    toggle_modal(modal_signup)
})
  nav_buttons.appendChild(btn_signup)

  var btn_login = document.createElement('a')
  btn_login.classList.add('button', 'is-light')
  btn_login.setAttribute('id','log-in')
  btn_login.innerText = 'Log in'
  btn_login.addEventListener('click', () => {
      form_login.reset()
      set_input_remove('log-in-modal', ['email','pass'])
      toggle_modal(modal_login)
  })
  nav_buttons.appendChild(btn_login)

}

function setup_post_login(username) {

  if (!username) {
    username = 'User'
  }

  var nav_buttons = document.getElementById('nav_btns')

  while (nav_buttons.firstChild) {
    nav_buttons.firstChild.remove()
  }

  var name_nav = create_set_append(nav_buttons, 'a', 'button is-primary has-text-weight-bold is-rounded', 'name_nav', [
    {name:'name', value:'userSettings'},
    {name:'style', value:'pointer-events: none;'}
  ])
  var nn_span_tag = create_set_append(name_nav, 'span', 'icon')
  create_set_append(nn_span_tag, 'i', 'fas fa-solid fa-user')
  var nn_text = create_set_append(name_nav, 'span', undefined, 'name-nav-text')
  nn_text.innerText = username

  var btn_logout = create_set_append(nav_buttons, 'a', 'button is-light', 'log-out')
  btn_logout.innerText = 'Log out'

  btn_logout.addEventListener('click', () => {
    // log out
    firebase.auth().signOut()
    .then(() => {
      //setup_pre_login() // firebase signout refreshes scripts...not sure why?
    }).catch(() => {
      console.log('log out failed')
    });
  });
}

function login_user() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // user signed in
      login_initial_checks(user)
      setup_post_login(user.displayName)
      return user
    } else {
      // User not signed in
      // if page needs authentication then go back to home page
      if (PAGES_AUTH_NOT_NEEDED.includes(window.location.pathname) == false) {
          window.location.pathname = "/index"
      }

      var nav_buttons = document.getElementById('nav_btns')

      while (nav_buttons.firstChild) {
        nav_buttons.firstChild.remove()
      }

      // for pages that don't need authentication, create signup/login nav btns
      var btn_signup = create_set_append(nav_buttons, 'a', 'button is-primary', 'sign-up')
      var text_signup = create_set_append(btn_signup, 'strong')
      text_signup.innerText = 'Sign up'
      var btn_login = create_set_append(nav_buttons, 'a', 'button is-light', 'log-in')
      btn_login.innerText = 'Log in'

      // Modals
      signup_button()
      login_button()
      signup_form_submit()
      login_form_submit()
    }
  })
}




export { db,
          login_initial_checks,
          send_email_verification,
          signup_button,
          login_button,
          signup_form_submit,
          login_form_submit,
          setup_post_login,
          login_user,
          set_input_remove
        }



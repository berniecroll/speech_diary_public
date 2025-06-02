import {
    set_input_remove
} from "./modules/auth.js"

import {
    build_login_modal,
    build_signup_modal
} from "./modules/modal.js"

// CONSTANTS
var NAV_MAPPING = {
    'dashboard':'dashboard.html'
}

var NAVS_TO_CHECK_ACCESS = Object.keys(NAV_MAPPING)

// FUNCTIONS
// main()
// setup_nav_checks()

function main() {
    setup_modals()
    setup_burger()
    setup_nav_checks()
}

function setup_modals() {
    var modals = document.getElementById('modals')
    build_login_modal(modals)
    build_signup_modal(modals)
}

function setup_burger() {
    var burger = document.getElementById('navbar-burger')
    burger.addEventListener('click', () => {
        var nav_menu = document.getElementById('navbar-menu')
        burger.classList.toggle('is-active') // turns the hamburger menu into a cross
        nav_menu.classList.toggle('is-active') // nav menu hidden on touch devices unless specififed with is-active
    });
}

function setup_nav_checks() {
    var nav_items = document.getElementsByClassName('navbar-item')

    for (var i of nav_items) {

        var file = i.getAttribute('name')
        if (NAVS_TO_CHECK_ACCESS.includes(file)) {
            i.addEventListener('click', (e) => {check_log_in(e)})
        }

    }
}

// what if user open dashboard page and is logged out?
function check_log_in(e) {
    e.preventDefault()
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            var modal = document.getElementById('log-in-modal')
            var form = document.getElementById('login-form')
            form.reset()
            set_input_remove('log-in-modal', ['email','pass'])
            modal.classList.toggle('is-active')
        } else {
            window.location.pathname = NAV_MAPPING[e.target.name]
        }
    });
}


main()

export {
    check_log_in
}
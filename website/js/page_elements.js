import { 
    remove_children, 
    create_set_append 
} from "./modules/utilities.js";


function main() {
    generate_footer()
    generate_nav()
}


function generate_footer() {
    var div = document.getElementById('footer')
    var footer_tag = create_set_append(div, 'footer', 'footer')
    var f_content = create_set_append(footer_tag, 'div', 'content has-text-centered')
    var fc_p = create_set_append(f_content, 'p')
    var fcp_strong = create_set_append(fc_p, 'strong')
    fcp_strong.innerText = 'Speech Diary'
}

function generate_nav() {
    var modals_div = document.getElementById('modals')

    var nav = document.createElement('nav')

    nav.setAttribute('class', 'navbar is-spaced')
    nav.setAttribute('role', 'navigation')
    nav.setAttribute('aria-label', 'main navigation')

    var navbrand = create_set_append(nav, 'div', 'navbar-brand')
    var navbrand_item = create_set_append(navbrand, 'a', 'navbar-item', undefined, [{name:'href', value:"index.html"}])
    var item_img = create_set_append(navbrand_item, 'img', undefined, undefined, [
        {name:'src', value:"/images/logo.svg"},
        {name:'style', value:"width: 150px; height: auto;"}
    ])
    var navbrand_burger = create_set_append(navbrand, 'a', 'navbar-burger', 'navbar-burger', [
        {name:'role', value:"button"},
        {name:'aria-label', value:"menu"},
        {name:'aria-expanded', value:"false"}
        //{name:'data-target', value:"navbarBasicExample"}
    ])
    var burger_line1 = create_set_append(navbrand_burger, 'span', undefined, undefined, [{name:'aria-hidden', value:'true'}])
    var burger_line2 = create_set_append(navbrand_burger, 'span', undefined, undefined, [{name:'aria-hidden', value:'true'}])
    var burger_line3 = create_set_append(navbrand_burger, 'span', undefined, undefined, [{name:'aria-hidden', value:'true'}])

    var navbar_menu = create_set_append(nav, 'div', 'navbar-menu', 'navbar-menu')

    var navbar_menu_start = create_set_append(navbar_menu, 'div', 'navbar-start')
    var about_page = create_set_append(navbar_menu_start, 'a', 'navbar-item is-tab', undefined, [{name:'href', value:"about.html"}])
    about_page.innerText = 'About'
    var dashboard_page = create_set_append(navbar_menu_start, 'a', 'navbar-item is-tab', undefined, [{name:'name', value:"dashboard"}])
    dashboard_page.innerText = 'Dashboard'
    var contact_page = create_set_append(navbar_menu_start, 'a', 'navbar-item is-tab', undefined, [{name:'href', value:"contact.html"}])
    contact_page.innerText = 'Contact'

    var navbar_menu_end = create_set_append(navbar_menu, 'div', 'navbar-end')
    var menu_end_item = create_set_append(navbar_menu_end, 'div', 'navbar-item')
    var item_nav_btns = create_set_append(menu_end_item, 'div', 'buttons', 'nav_btns')

    modals_div.parentNode.insertBefore(nav, modals_div)
}


main()


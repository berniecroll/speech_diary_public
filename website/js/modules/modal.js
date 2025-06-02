import { create_set_append } from "./utilities.js"

// functions
// build_login_modal(first_element)
// build_signup_modal(first_element)
// build_form_field(form, name_attr, innertext, type_attr, example, icon)


function build_login_modal(first_element) {
    var modal = create_set_append(first_element,'div', 'modal', 'log-in-modal')
    var modal_background = create_set_append(modal,'div', 'modal-background')
    var modal_content = create_set_append(modal, 'div', 'modal-content')
    var modal_close = create_set_append(modal, 'button', 'modal-close is-large', undefined, [
        {name:"aria-label", value:"close"}
    ])
    var main_box = create_set_append(modal_content, 'div', 'box')
    var title = create_set_append(main_box, 'h1', 'title')
    title.innerText = 'Log in'
    var form = create_set_append(main_box, 'form', undefined, 'login-form')

    // build_form_field(form, name_attr, innertext, type_attr, example, icon)
    build_form_field(form, 'email', 'Email', 'email', 'E.g. jane@smith.com', 'fa-envelope')
    build_form_field(form, 'pass', 'Password', 'password', "E.g. a_really_strong_password", 'fa-key')

    // buttons field
    var field = create_set_append(form, 'div', 'field is-grouped', undefined, [{name:'name',value:'btns'}])
    var f_ctrl_1 = create_set_append(field, 'div', "control")
    var f_c_input = create_set_append(f_ctrl_1, 'button', 'button is-link', 'btn-submit-login', [
        {name:'name', value:"btn-submit"}
    ])
    f_c_input.innerText = 'Submit'
    var f_ctrl_2 = create_set_append(field, 'div', "control")
    var f_c_input = create_set_append(f_ctrl_2, 'button', 'button is-link is-light', 'btn-cancel-login', [
        {name:'name', value:"btn-cancel"}
    ])
    f_c_input.innerText = 'Cancel'
    
}

function build_signup_modal(first_element) {
    var modal = create_set_append(first_element,'div', 'modal', 'sign-up-modal')
    var modal_background = create_set_append(modal,'div', 'modal-background')
    var modal_content = create_set_append(modal, 'div', 'modal-content')
    var modal_close = create_set_append(modal, 'button', 'modal-close is-large', undefined, [
        {name:"aria-label", value:"close"}
    ])
    var main_box = create_set_append(modal_content, 'div', 'box')
    var title = create_set_append(main_box, 'h1', 'title')
    title.innerText = 'Sign Up'
    var form = create_set_append(main_box, 'form', undefined, 'signup-form')

    // build_form_field(form, name_attr, innertext, type_attr, example, icon)
    build_form_field(form, 'name', 'First Name', 'text', "E.g. Jane", 'fa-user')
    build_form_field(form, 'email', 'Email', 'email', 'E.g. jane@smith.com', 'fa-envelope')
    build_form_field(form, 'pass', 'Password', 'password', "E.g. a_really_strong_password", 'fa-key')
    build_form_field(form, 'confirm-pass', 'Confirm Password', 'password', "Same as above.", 'fa-key')

    // buttons field
    var field = create_set_append(form, 'div', 'field is-grouped', undefined, [{name:'name',value:'btns'}])
    var f_ctrl_1 = create_set_append(field, 'div', "control")
    var f_c_input = create_set_append(f_ctrl_1, 'button', 'button is-link', 'btn-submit-signup', [
        {name:'name', value:"btn-submit"}
    ])
    f_c_input.innerText = 'Submit'
    var f_ctrl_2 = create_set_append(field, 'div', "control")
    var f_c_input = create_set_append(f_ctrl_2, 'button', 'button is-link is-light', 'btn-cancel-signup', [
        {name:'name', value:"btn-cancel"}
    ])
    f_c_input.innerText = 'Cancel'
}

function build_form_field(form, name_attr, innertext, type_attr, example, icon) {
    // main field pattern
    var field = create_set_append(form, 'div', 'field', undefined, [{name:'name',value:name_attr}])
    var f_label = create_set_append(field, 'label', 'label')
    f_label.innerText = innertext
    var f_ctrl = create_set_append(field, 'div', "control has-icons-left has-icons-right")
    var f_c_input = create_set_append(f_ctrl, 'input', 'input', undefined, [
        {name:'type', value:type_attr}, {name:'name', value:name_attr}, {name:'placeholder', value:example}
    ])
    var f_c_span1 = create_set_append(f_ctrl, 'span', 'icon is-small is-left')
    var f_c_s1_i = create_set_append(f_c_span1, 'i', 'fas ' + icon)
    var f_c_span2 = create_set_append(f_ctrl, 'span', 'icon is-small is-right')
    var f_c_s2_i = create_set_append(f_c_span2, 'i', 'fas', undefined, [{name:'name',value:name_attr}])
    var f_help = create_set_append(field, 'p', 'help', undefined, [{name:'name',value:name_attr}])

}


export {
    build_login_modal,
    build_signup_modal,
    build_form_field
}
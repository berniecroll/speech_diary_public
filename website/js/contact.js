import { db } from "./modules/auth.js";
import { build_form_field } from "./modules/modal.js";
import { create_set_append, remove_children } from "./modules/utilities.js";

function handle_form_click(form, event) {
    // send
    if (event.target.id == 'btn-submit-contact') {
        var inputs = form.elements
        var email = inputs['email'].value
        var name = inputs['name'].value
        var msg = document.getElementById('contact_message').value
        
        if (email == '' || name == '' || msg == '') {
            console.log('Error: Empty message.')
            // add more to warn users
            
        }
        else {
            send_message(email, name, msg)
        }
        

    } else {
        console.log('Error button target not found')
    }
}

function send_message(email, name, msg) {
    const contact_docRef = db.collection('mail').add({
        to: "hello@speech-diary.com",
        template: {
            name: "contact_template",
            data: {
                msg: 
`email:${email}
name:${name}
msg:${msg}
`
            }
        }

    })
    .then(
        () => {
            var contact_column = document.getElementById('contact-column')
            remove_children(contact_column)
            var new_title = create_set_append(contact_column, 'h1', 'title has-text-centered')
            new_title.innerText = 'Thank you for contacting us!'
            console.log('Contact email sent.')
        }
    )
    .catch(
        (error) => {
            console.log('Error sending contact email: ', error)
        }
    )
}


if (window.location.pathname == "/contact") {

    var contact_div = document.getElementById('form')
    var contact_col = create_set_append(contact_div, 'div', 'column is-half is-offset-one-quarter', 'contact-column')

    var title = create_set_append(contact_col, 'h1', 'title has-text-centered')

    title.innerText = 'Send us a message.'

    // Build form
    var main_box = create_set_append(contact_col, 'div', 'box')
    var form = create_set_append(main_box, 'form', undefined)

    // build_form_field(form, name_attr, innertext, type_attr, example, icon)
    build_form_field(form, 'email', 'Email', 'email', 'E.g. jane@smith.com', 'fa-envelope')
    build_form_field(form, 'name', 'Name', 'text', "E.g. Jane", 'fa-user')

    // main field pattern
    var field = create_set_append(form, 'div', 'field', undefined, [{name:'name',value:'message'}])
    var f_label = create_set_append(field, 'label', 'label')
    f_label.innerText = 'Message'
    var f_ctrl = create_set_append(field, 'div', "control")
    var f_c_input = create_set_append(f_ctrl, 'textarea', 'textarea', 'contact_message', [
        {name:'placeholder', value:'Type your message here...'}
    ])

    // buttons field
    var field = create_set_append(form, 'div', 'field is-grouped', undefined, [{name:'name',value:'btns'}])
    var f_ctrl_1 = create_set_append(field, 'div', "control")
    var f_c_input = create_set_append(f_ctrl_1, 'button', 'button is-link', 'btn-submit-contact', [
        {name:'name', value:"btn-submit"}
    ])
    f_c_input.innerText = 'Submit'

    // contact form btn funtionality
    var submit = document.getElementById('btn-submit-contact')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })
    submit.addEventListener('click', (event) => {
        handle_form_click(form, event)
    })

}
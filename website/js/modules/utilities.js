function create_n_set_text(tag_name, text) {
    var tag = document.createElement(tag_name)
    tag.innerText = text
    return tag
  }

function remove_children(element) {
    if (element) {
        while (element.firstChild) {
            element.firstChild.remove()
        }
    }
}

// automate building process
function create_set_append(parent, tag_type, class_text, id_text, attribute_list) {
    var child = document.createElement(tag_type)

    if (class_text != undefined) {
        child.setAttribute('class', class_text)
    }
    if (id_text != undefined) {
        child.setAttribute('id', id_text)
    }

    if (parent != undefined) {
        parent.appendChild(child)
    }

    if (attribute_list != undefined) {
        for (var i of attribute_list) {
            var name = i['name']
            var value = i['value']
            if (name != undefined && value != undefined) {
                child.setAttribute(i['name'],i['value'])
            }
        }
    }

    return child
}


export { create_n_set_text,
            remove_children,
            create_set_append
        }
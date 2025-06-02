import { login_initial_checks, db, login_user} from "./modules/auth.js";
import { remove_children, create_set_append } from "./modules/utilities.js";

// functions
// function add_setup_events_to_menu_tab()
// function setup_logging()
// function send_logs(log_docRef)
// function set_streak(dates)
// function change_dashboard_title(title)
// function change_active_menu(menu_tab)
// function wipe_main_content(tab_name)
// function set_slider_events()
// function build_dashboard_content(tab_name)
// function build_log_content(tab_name)
// function build_visualise_content(tab_name)
// function build_share_content(tab_name)
// function setup_dashboard()
// function setup_log()
// function setup_visualise()
// function setup_share()
// function build_charts()

function main() {
    if (window.location.pathname == "/dashboard") {
        login_user()
        add_setup_events_to_menu_tab()
        setup_logging()
        set_slider_events()
        build_charts()
    }
}

function add_setup_events_to_menu_tab() {
    var menu_dash = document.getElementById('menu-dash')
    var menu_log = document.getElementById('menu-log')
    var menu_vis = document.getElementById('menu-vis')
    var menu_share = document.getElementById('menu-share')
    var menu_settings_user = document.getElementById('menu-settings-user')
    var touch_side_nav_trigger = document.getElementById('touch-side-nav-trigger')

    menu_dash.onclick = setup_dashboard
    menu_log.onclick = setup_log
    menu_vis.onclick = setup_visualise
    menu_share.onclick = setup_share
    menu_settings_user.onclick = setup_settings_user
    touch_side_nav_trigger.onclick = setup_touch_menu_trigger

}

// load user for log page
function setup_logging() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            return false
        }

        // user id
        var uid = user.uid;

        // fetch date
        var nowDate = new Date(); 
        var year = nowDate.getFullYear()
        var month = nowDate.getMonth()
        var day = nowDate.getDate();
        var date = new Date(year,month,day).valueOf()
        const log_docRef = db.doc(`users/${uid}/history/${date}`);

        // check if log has already been done
        log_docRef.get().then((doc) => {
            var sev_rat = document.getElementById("sev-rating")
            var flu_rat = document.getElementById("flu-rating")
            var log_button = document.getElementById('log-button')
            log_button.classList.remove('is-loading')

            if(doc.exists) {
                // disable input as log exists
                var data = doc.data()
                sev_rat.setAttribute('placeholder',data['severity-rating'])
                flu_rat.setAttribute('placeholder',data['fluency-rating'])
                sev_rat.disabled = 'disabled'
                flu_rat.disabled = 'disabled'
                log_button.disabled = 'disabled'
                log_button.innerText = 'Already Sent'

            } else {
                // enable input as log does not exist
                flu_rat.classList.remove('is-danger')
                sev_rat.classList.remove('is-danger')
                flu_rat.classList.add('is-success')
                sev_rat.classList.add('is-success')
                log_button.addEventListener('click', () => {
                    send_logs(log_docRef) 
                });
            }
        }).catch((error) => {
            console.log("Error getting document: ", error)
        });

        return true
    });
}

function send_logs(log_docRef) {

    document.getElementById('log-button').classList.add('is-loading')
    var sr = document.getElementById("sev-rating").value
    var ft = document.getElementById("flu-rating").value
    var sev_rat = document.getElementById("sev-rating")
    var flu_rat = document.getElementById("flu-rating")

    // To improve chart readability 0 values are 0.2
    if (sr == 0) {
        sr = 0.2
    }
    if (ft == 0) {
        ft = 0.2
    }

    log_docRef.set({
        "severity-rating": sr,
        "fluency-rating": ft,
    })
    .then(() => {
        document.getElementById('log-button').classList.remove('is-loading')
        console.log("Works!");
        document.getElementById("sev-rating").disabled = 'disabled'
        document.getElementById("flu-rating").disabled = 'disabled'
        flu_rat.classList.remove('is-success')
        sev_rat.classList.remove('is-success')
        flu_rat.classList.add('is-danger')
        sev_rat.classList.add('is-danger')

        build_charts()

    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

}

// set streak
function set_streak(dates) {

    // Ensures dates are sorted in descending order
    dates.sort((a, b) => b - a)

    var streak = 0
    var gap = 0
    var nowDate = new Date()
    var unix_start_day = new Date(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate()).valueOf()

    // ensures streak is only updated when there is a log for the day
    if (dates.length != 0 && unix_start_day != dates[0]) {
        // make start day to be yesterday
        var yesterday = new Date(new Date().setDate(new Date().getDate()-1))
        unix_start_day = new Date(yesterday.getFullYear(),yesterday.getMonth(),yesterday.getDate()).valueOf()
    }
    
    for (var date of dates) {
        // rounding prevents issues with day light savings
        var date_diff = Math.round((unix_start_day - date)/1000/60/60/24)
        if (date_diff == gap) {
            streak = streak + 1
            gap = gap + 1
        } else if (date_diff < gap) { // Ignore if on the same day
            continue
        } else {
            break
        }
    }

    var curr_streak = document.getElementById('current-streak-score')
    var streak_text = document.getElementById('streak-text')

    curr_streak.innerText = streak  
    streak_text.innerText = ' Day Streak'
}

function change_dashboard_title(title) {
    var dash_title = document.getElementById('dash-title')
    dash_title.innerText = title
}

function change_active_menu(menu_tab) {
    var all_menu_tabs = document.getElementsByClassName('menu-item')
    for (var i of all_menu_tabs) {
        if (i.id == menu_tab) {
            i.classList.add('is-active')
        } else {
            i.classList.remove('is-active')
        }
    }
}

function wipe_main_content(tab_name) {
    var menu_tab = document.getElementById(tab_name)
    if (!menu_tab.classList.contains('is-active')) {
        var main_content = document.getElementById('main-content')
        remove_children(main_content)
    }
}


function set_slider_events() {
    var sev_slider = document.getElementById("sevRange");
    var flu_slider = document.getElementById("fluRange");
    var sev_rating = document.getElementById("sev-rating");
    var flu_rating = document.getElementById("flu-rating");
    sev_rating.value = sev_slider.value;
    flu_rating.value = flu_slider.value;
    
    // Update the current slider value (each time you drag the slider handle)
    flu_slider.oninput = function() {
      flu_rating.value = this.value;
    }
    sev_slider.oninput = function() {
      sev_rating.value = this.value;
    }
}


function build_dashboard_content(tab_name) {
    var menu_tab = document.getElementById(tab_name)
    if (!menu_tab.classList.contains('is-active')) {

        var main_content = document.getElementById('main-content')
        var top_columns = create_set_append(main_content,'div','columns')
        var child_column1 = create_set_append(top_columns, 'div', 'column is-2 is-offset-1')
        var child_column2 = create_set_append(top_columns, 'div', 'column is-8', 'dash-vis-col')

        var col1_box1 = create_set_append(child_column1, 'div', 'box has-text-centered')
        var col1_box2 = create_set_append(child_column1, 'div', 'box')
        var col1_box3 = create_set_append(child_column1, 'div', 'box')
        var col1_button1 = create_set_append(child_column1, 'button', 
                                            'button is-loading is-fullwidth is-primary is-outlined',
                                            "log-button")
        col1_button1.innerText = 'Send'

        var c1_b1_p = create_set_append(col1_box1, 'p')
        var b1_span1 = create_set_append(c1_b1_p, 'span', "has-text-weight-bold", 'current-streak-score')
        var b1_span2 = create_set_append(c1_b1_p, 'span', undefined, "streak-text")
        b1_span2.innerText = 'Loading.. Streak'

        var c1_b2_p = create_set_append(col1_box2, 'p')
        c1_b2_p.innerText = 'Severity Rating'
        var c1_b2_input1 = create_set_append(col1_box2, 'input', 'slider', 'sevRange')
        c1_b2_input1.setAttribute('type', 'Range')
        c1_b2_input1.setAttribute('min','0')
        c1_b2_input1.setAttribute('max','8')
        c1_b2_input1.setAttribute('value','4')
        c1_b2_input1.setAttribute('style','width: 100%')
        var c1_b2_input2 = create_set_append(col1_box2, 'input', 'input is-danger', 'sev-rating')
        c1_b2_input2.setAttribute('type', 'text')

        var c1_b3_p = create_set_append(col1_box3, 'p')
        c1_b3_p.innerText = 'Fluency Rating'
        var c1_b3_input1 = create_set_append(col1_box3, 'input', 'slider', 'fluRange')
        c1_b3_input1.setAttribute('type', 'Range')
        c1_b3_input1.setAttribute('min','0')
        c1_b3_input1.setAttribute('max','8')
        c1_b3_input1.setAttribute('value','4')
        c1_b3_input1.setAttribute('style','width: 100%')
        var c1_b3_input2 = create_set_append(col1_box3, 'input', 'input is-danger', 'flu-rating')
        c1_b3_input2.setAttribute('type', 'text')

        // column two
        var col2_vis_notify = create_set_append(child_column2, 'div', undefined, 'notif-place')
        var col2_main_vis = create_set_append(child_column2, 'div', undefined, 'dash-main-vis')
        var c2_bv_load = create_set_append(col2_main_vis, 'button', 'button is-loading is-ghost is-large',
                                        'dash-vis-load')
        
        // main vis
        set_slider_events()
        setup_logging()
        build_charts()
    }
}

function build_log_content(tab_name) {
    var menu_tab = document.getElementById(tab_name)
    if (!menu_tab.classList.contains('is-active')) {
        var main_content = document.getElementById('main-content')
        var box = create_set_append(main_content,'div','box')
        var h1 = create_set_append(box, 'h1', 'title is-4')
        h1.innerText = 'Coming Soon...'
    }
}

function build_visualise_content(tab_name) {
    var menu_tab = document.getElementById(tab_name)
    if (!menu_tab.classList.contains('is-active')) {
        var main_content = document.getElementById('main-content')
        var box = create_set_append(main_content,'div','box')
        var h1 = create_set_append(box, 'h1', 'title is-4')
        h1.innerText = 'Coming Soon...'
    }
}

function build_share_content(tab_name) {
    var menu_tab = document.getElementById(tab_name)
    if (!menu_tab.classList.contains('is-active')) {
        var main_content = document.getElementById('main-content')
        var box = create_set_append(main_content,'div','box')
        var h1 = create_set_append(box, 'h1', 'title is-4')
        h1.innerText = 'Coming Soon...'
    }
}

function build_settings_user_content(tab_name) {
    var menu_tab = document.getElementById(tab_name)
    if (!menu_tab.classList.contains('is-active')) {
        var main_content = document.getElementById('main-content')
        var container = create_set_append(main_content, 'div', 'container')
        var table = create_set_append(container, 'table', 'table is-fullwidth is-size-5 has-text-centered')
        var thead = create_set_append(table, 'thead')
        var tr_headers = create_set_append(thead, 'tr')
        create_set_append(tr_headers, 'th').innerText = ''
        create_set_append(tr_headers, 'th').innerText = ''
        var tbody =  create_set_append(table, 'tbody')
        var tr_name = create_set_append(tbody, 'tr')
        create_set_append(tr_name, 'th').innerText = 'Profile Name'
        var name_value_cell = create_set_append(tr_name, 'th')

        // create form
        var cell_field = create_set_append(name_value_cell, 'div', 'field has-addons')
        var cf_ctrl_btn = create_set_append(cell_field, 'div', 'control')
        var cf_btn = create_set_append(cf_ctrl_btn, 'a', 'button is-info', undefined, [
            {name:'disabled', value:''}
        ])
        cf_btn.innerText = 'Change'
        var cf_ctrl_input = create_set_append(cell_field, 'div', 'control')
        var cf_input = create_set_append(cf_ctrl_input, 'input', 'input is-loading', 'settings-name', [
            {name:'type', value:'text'}, {name:'name', value:'name_input'}, 
            {name:'placeholder', value:'Loading'}
        ])
        
        // get current name
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if (user.displayName == undefined) {
                    var username = 'User'
                } else {
                    var username = user.displayName
                }
                // fill form
                cf_input.classList.remove('is-loading')
                cf_input.setAttribute('value',username)
                cf_input.setAttribute('placeholder','Choose a new name')
                cf_btn.removeAttribute('disabled')

                cf_btn.addEventListener('click', (event) => {
                    var new_name = document.getElementById('settings-name').value

                    user.updateProfile({
                        displayName:new_name
                    }).then(() => {
                        console.log('Works')
                        cf_btn.setAttribute('disabled','')
                        cf_input.setAttribute('disabled','')
                        // Change name in nav
                        document.getElementById('name-nav-text').innerText = user.displayName
                    })
                    .catch((error) => {
                        console.log('Error updating profile', error)
                    })
                })
            }
        })
    }
}

function setup_dashboard() {
    wipe_main_content('menu-dash')
    build_dashboard_content('menu-dash')
    change_active_menu('menu-dash')
    change_dashboard_title('Dashboard')
}

function setup_log() {
    wipe_main_content('menu-log')
    build_log_content('menu-log')
    change_active_menu('menu-log')
    change_dashboard_title('Log your speech')
}

function setup_visualise() {
    wipe_main_content('menu-vis')
    build_visualise_content('menu-vis')
    change_active_menu('menu-vis')
    change_dashboard_title('Visualise your speech')
}

function setup_share() {
    wipe_main_content('menu-share')
    build_share_content('menu-share')
    change_active_menu('menu-share')
    change_dashboard_title('Share your speech')
}

function setup_settings_user() {
    wipe_main_content('menu-settings-user')
    build_settings_user_content('menu-settings-user')
    change_active_menu('menu-settings-user')
    change_dashboard_title('User Settings')
}

function setup_touch_menu_trigger() {
    var side_nav_column = document.getElementById('side-nav-column')
    side_nav_column.classList.toggle('is-hidden-touch')
    side_nav_column.classList.toggle('has-text-centered')
}

function build_charts() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          var userRef = db.collection("users").doc(uid).collection("history").get()
            .then((querySnapshot) => {
                var data = []
                // get data
                querySnapshot.forEach((doc) => {

                    data.push({'date':Number(doc.id), 'sr':doc.data()['severity-rating'], 'fr':doc.data()['fluency-rating']})
                });

                // sort to be descending
                data.sort((a, b) => b['date'] - a['date'])
                
                var dates = []
                var sr_hist = []
                var fr_hist = []
                var range_start
                var range_end

                for (var i of data) {
                dates.push(i['date'])
                sr_hist.push(i['sr'])
                fr_hist.push(i['fr'])
                }

                // add extra day to start and end of range to look better
                range_start = new Date(dates[dates.length-1])
                range_start = new Date(range_start.setDate(range_start.getDate()-1))
                range_end = new Date(dates[0])
                range_end = new Date(range_end.setDate(range_end.getDate()+1))

                // Remove loading icon after vis

                var severity_data = {
                    name: 'Severity Rating',
                    x:dates,
                    y:sr_hist,
                    type:'scatter'
                }

                var fluency_data = {
                    name: 'Fluency Rating',
                    x:dates,
                    y:fr_hist,
                    type:'scatter'
                }

                data = [severity_data, fluency_data]

                var layout = {
                    legend: {
                        orientation: "h",
                        y: "1.2",
                        x: "0.4"
                    },
                    xaxis: {
                        autorange: false,
                        range: [range_start, range_end],
                        rangeslider: {range: [range_start, range_end]},
                        type: 'date',
                        /*rangeselector: {
                            buttons: [
                                {   count:1,
                                    label: 'This Week',
                                    step: 'week',
                                    stepmode:'backward'},
                            ]
                        }*/
                    },
                    yaxis: {
                        range:[0,8]
                    }
                }

                var config = {
                    displaylogo: false,
                    responsive: true,
                    modeBarButtonsToRemove: ['pan2d','select2d','lasso2d',
                                            'zoomOut2d','zoomIn2d','autoScale2d'],
                    toImageButtonOptions: {
                        filename: 'speech_diary_chart'
                    }
                }

                // show the plot, appending it to the end of the current section
                var main_vis = document.getElementById('dash-main-vis')
                remove_children(main_vis)
                Plotly.newPlot(main_vis, data, layout, config);
                
                // Trigger help notification is plot is empty i.e. first time user
                var del_check = localStorage.getItem('chart_notification_del')
                if (del_check == null) {
                    del_check = 'false'
                }
                if (dates.length <= 0 && del_check == 'false') {

                    var notif_place = document.getElementById('notif-place')
                    var vis_note = create_set_append(notif_place, 'div', 'notification')
                    var del_btn = create_set_append(vis_note, 'button', 'delete')
                    del_btn.insertAdjacentText('afterend', `
                    Welcome to your personal dashboard!
                    The chart below is empty as you have not logged your speech behaviour for the day.
                    Move the sliders to choose a Severity and Fluency rating and click Send to update the chart.
                    `)
                    del_btn.addEventListener('click', () => {
                        notif_place.parentNode.removeChild(notif_place)
                        localStorage.setItem('chart_notification_del', 'true')
                    })
                }


                set_streak(dates)

            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        } else {
            console.log('User not signed in!')
        }
    });

}

// START MAIN FUNCTION
main()

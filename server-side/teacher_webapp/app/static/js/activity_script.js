const activities_wrapper = document.querySelector('.activities-wrapper');
const label = document.querySelector('.activities-wrapper h1');
const add_activity_btn = document.querySelector('.add-button');
const bins = [];
const tiles = [];
const activity_labels = [];
const chosen_activity_label = document.getElementById('class-label');
let activity_type = "";


if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

fetch('')
  .then(response => response.json())
  .then(data => {
    const activity_data = data.data;
    activity_type = data.activity;
    if (activity_data.length != 0) {
        console.log(data.activity);
        const subjects = [];
        const subinfo = [];
        let str = "";
        switch (data.activity) {
            case 'olympiads':
                chosen_activity_label.textContent = "Олимпиады";
                add_activity_btn.textContent = "Добавить олимпиаду";
                for (let i = 0; i < activity_data.length; i++) {
                    str = `Место: ${activity_data[i].place}`;
                    subinfo.push(str);
                    subjects.push(activity_data[i].name);
                }
                add_buttons(activity_data, subjects, subinfo, data.pic);
                break;
    
            case 'tutors':
                chosen_activity_label.textContent = "Репетиторы";
                add_activity_btn.textContent = "Добавить репетитора";
                for (let i = 0; i < activity_data.length; i++) {
                    str = `Репетитор: ${activity_data[i].surname} ${activity_data[i].name} ${activity_data[i].patronymic}`;
                    subinfo.push(str);
                    subjects.push(activity_data[i].subject);
                }
                add_buttons(activity_data, subjects, subinfo, data.pic);
                break;
    
            case 'afterschools':
                chosen_activity_label.textContent = "Кружки";
                add_activity_btn.textContent = "Добавить кружок";
                for (let i = 0; i < activity_data.length; i++) {
                    subjects.push(activity_data[i].subject);
                }
                add_buttons(activity_data, subjects, subinfo, data.pic);
                break;
    
            default:
                chosen_activity_label.textContent = "Ошибка";
                break;
        }
    } else {
        label.textContent = "Нет данных о выбранном виде активности ученика";
    }

    
  })
  .catch(error => {
    console.error(error);
  });

function add_tile(activity, activity_label, text_label, bin, activity_id, subinfo, info, pic) {
    const img_wrap = document.createElement('img');
    const bin_wrapper = document.createElement('div');
    const activity_wrapper = document.createElement('div');
    const allinfolabel = document.createElement('div');
    const activity_name_span = document.createElement('span');
    const place_wrapper = document.createElement('div');
    const activity_subinfo_span = document.createElement('span');
    const info_wrapper = document.createElement('div');
    const info_span = document.createElement('span')
    
    activities_wrapper.appendChild(activity);

    activity.classList.add('activity-tile');
    activity.appendChild(activity_label);
    activity.appendChild(bin_wrapper)
    bin_wrapper.classList.add('bin-wrapper')
    activity_label.classList.add('tile-label');
    bin_wrapper.appendChild(bin);
    activity.appendChild(activity_wrapper);
    

    activity_wrapper.appendChild(img_wrap);
    activity_wrapper.classList.add('activity-pic');
    activity.appendChild(allinfolabel);
    allinfolabel.appendChild(activity_label);
    activity_label.appendChild(activity_name_span);
    allinfolabel.appendChild(place_wrapper);
    place_wrapper.classList.add('place-label');
    place_wrapper.appendChild(activity_subinfo_span);
    activity.appendChild(info_wrapper);
    info_wrapper.classList.add('info-wrapper');
    info_wrapper.appendChild(info_span);

    img_wrap.src = pic;
    activity_name_span.textContent = text_label;
    activity_subinfo_span.textContent = subinfo;
    info_span.textContent = `Информация: ${info}`;
    
    bin.src = "http://127.0.0.1:8000/static/images/recycle_bin_white.png";
    bin.classList.add('bin');

    bin.addEventListener('click', () => {
        const bin_index = bins.indexOf(bin);
        const modal_window = document.createElement('div');

        modal_window.classList.add('modal-dialog', 'modal-dialog-centered');
        modal_window.style.zIndex = '1050';
        modal_window.style.position = 'absolute';
        modal_window.style.top = '0px';
        modal_window.style.left = '0px';
        modal_window.style.width = '100%';
        modal_window.style.height = '100%';
        modal_window.style.background = 'rgba(0, 0, 0, 0.4)';
        modal_window.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" style="border-radius: 10px;">
                <div class="modal-content" data-backdrop="static" style="box-sizing: border-box;">
                    <div class="modal-header">
                        <h5 class="modal-title" style="margin: 1vw;">Удалить активность?</h5>
                    </div>
                    <div class="modal-body" style="padding: 1vw;margin-bottom: 1vw;">
                        Вы уверены, что хотите удалить активность: "${text_label}"?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;">Отмена</button>
                        <button type="button" class="btn btn-danger" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;">Удалить</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal_window);

        const cancel_button = modal_window.querySelector('.btn-secondary');
        const submit_button = modal_window.querySelector('.btn-danger');

        cancel_button.addEventListener('click', () => {
            modal_window.remove();
        });

        submit_button.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    deleted_activity: {
                        activity_type: activity_type,
                        deleted_activity_id: activity_id
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bins.splice(bin_index, 1);
                    tiles.splice(bin_index, 1);
                    activity_labels.splice(bin_index, 1);
                    activity.remove();
                    if (tiles.length == 0) {
                        label.style = "display: inline-flex";
                        label.textContent = "Нет данных о выбранном виде активности ученика";
                    }
                    modal_window.remove();
                } else {
                    console.error('Error deleting activity:', data.error);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!modal_window.contains(e.target) && !bin.contains(e.target)) {
                modal_window.remove();
            }
        });
    });
}

function add_buttons(activity_data, subject, subinfo, pic_path) {
    for (let i = 0; i < activity_data.length; i++) {
        const activity = document.createElement('div');
        const activity_label = document.createElement('div');
        const bin = document.createElement('img');
        console.log(subject[i]);
        add_tile(
            activity,
            activity_label,
            subject[i],
            bin, 
            activity_data[i].id, 
            subinfo[i],
            activity_data[i].info,
            pic_path
            );
        bins.push(bin);
        tiles.push(activity);
    }
}
add_activity_btn.addEventListener('click', () => {
    // let 
    // switch (activity_type) {
    //     case 'olympiads':
            
    //         break;
    // }

    const modal_window = document.createElement('div');
    modal_window.classList.add('modal-dialog', 'modal-dialog-centered');
    modal_window.style.zIndex = '1050';
    modal_window.style.position = 'absolute';
    modal_window.style.top = '0px';
    modal_window.style.left = '0px';
    modal_window.style.width = '100%';
    modal_window.style.height = '100%';
    modal_window.style.background = 'rgba(0, 0, 0, 0.4)';
    modal_window.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" style="border-radius: 10px; width: 40vw">
            <div class="modal-content" data-backdrop="static" style="box-sizing: border-box;">
                <div class="modal-header">
                    <h5 class="modal-title" style="margin: 1vw;">Добавьте активность</h5>
                </div>
                <div class="modal-body" style="margin: 1.3vw;">
                    <div class="input-group" style="flex-direction: column;align-items: center;">
                        <div>
                            <h6 class="error-message"><h6>
                        </div>
                        <div style="display: inline-flex;width:100%; margin-bottom:1vw;">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Название</span>
                            </div>
                            <input type="text" class="form-control activity-name">
                        </div>
                        <div style="display: inline-flex;width:100%; margin-bottom:1vw;">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Место</span>
                            </div>
                            <input type="text" class="form-control activity-place">
                        </div>
                        <div style="display: inline-flex; width:100%; margin-bottom:1vw;">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Информация</span>
                            </div>
                            <input type="text" class="form-control activity-info">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;margin-top: 1vw;">Отмена</button>
                    <form method="post">
                        <button type="submit" class="btn add-activity-descr" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;margin-top: 1vw;">Добавить</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal_window);
    const cancel_button = modal_window.querySelector('.btn-secondary');
    const submit_button = modal_window.querySelector('.add-activity-descr');

    cancel_button.addEventListener('click', () => {
        modal_window.remove();
    });

    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        const activity_name = modal_window.querySelector('.activity-name');
        const activity_subinfo = modal_window.querySelector('.activity-place');
        const activity_info = modal_window.querySelector('.activity-info');
        const error_label = modal_window.querySelector('.error-message');
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                added_activity: {
                    name: activity_name.value,
                    subinfo: activity_subinfo.value,
                    info: activity_info.value,
                    type: activity_type
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const activity = document.createElement('div');
                const activity_label = document.createElement('div');
                const bin = document.createElement('img');
                bins.push(bin);
                tiles.push(activity);
                activity_labels.push(activity_name.value);
                add_tile(
                    activity,
                    activity_label,
                    activity_name.value,
                    bin,
                    data.ID,
                    activity_subinfo.value,
                    activity_info.value,
                    "http://127.0.0.1:8000/static/images/activity_backgrounds/2.jpg"
                );
                label.style = "display: none";
                error_label.style = "display: none";
                modal_window.remove();
            } else {
                switch (data.message?.schema_text[0]) {
                    case "Invalid value.":
                        error_label.style = "display: flex";
                        error_label.textContent = "Пожалуйста, введите корректное название";
                        break;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    document.addEventListener('click', (e) => {
        if (!modal_window.contains(e.target) && !add_activity_btn.contains(e.target)) {
            modal_window.remove();
        }
    });
})

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

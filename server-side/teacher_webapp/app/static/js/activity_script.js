const activities_wrapper = document.querySelector('.activities-wrapper');
const label = document.querySelector('.activities-wrapper h1');
const add_activity_btn = document.querySelector('.add-button');
const bins = [];
const tiles = [];
const activity_labels = [];
const bin_path = "/static/images/recycle_bin_white.png";
const chosen_activity_label = document.getElementById('class-label');
let activity_type = "";
let temp = "";
let isBinActive= false, isAddActive = false;


if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

fetch('')
  .then(response => response.json())
  .then(data => {
    const activity_data = data.data;
    activity_type = data.activity;
    switch (activity_type) {
        case 'olympiads':
            chosen_activity_label.textContent = "Олимпиады";
            add_activity_btn.textContent = "Добавить олимпиаду";
            break;

        case 'tutors':
            chosen_activity_label.textContent = "Репетиторы";
            add_activity_btn.textContent = "Добавить репетитора";
            break;

        case 'afterschools':
            chosen_activity_label.textContent = "Кружки";
            add_activity_btn.textContent = "Добавить кружок";
            break;

        default:
            chosen_activity_label.textContent = "Ошибка";
            break;
    }
    if (activity_data.length != 0) {
        const subjects = [];
        const subinfo = [];
        let str = "";
        switch (data.activity) {
            case 'olympiads':
                chosen_activity_label.textContent = "Олимпиады";
                add_activity_btn.textContent = "Добавить олимпиаду";
                for (let i = 0; i < activity_data.length; i++) {
                    activity_data[i].place != "" ? str = `Место: ${activity_data[i].place}` : str = ``
                    subinfo.push(str);
                    subjects.push(activity_data[i].name);
                }
                add_buttons(activity_data, subjects, subinfo);
                break;
    
            case 'tutors':
                chosen_activity_label.textContent = "Репетиторы";
                add_activity_btn.textContent = "Добавить репетитора";
                for (let i = 0; i < activity_data.length; i++) {
                    str = `Репетитор: ${activity_data[i].surname} ${activity_data[i].name} ${activity_data[i].patronymic}`;
                    subinfo.push(str);
                    subjects.push(activity_data[i].subject);
                }
                add_buttons(activity_data, subjects, subinfo);
                break;
    
            case 'afterschools':
                chosen_activity_label.textContent = "Кружки";
                add_activity_btn.textContent = "Добавить кружок";
                for (let i = 0; i < activity_data.length; i++) {
                    subjects.push(activity_data[i].subject);
                }
                add_buttons(activity_data, subjects, subinfo);
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
    if (info)
        info_span.textContent = `Информация: ${info}`;
    
    bin.src = bin_path;
    bin.classList.add('bin');

    bin.addEventListener('click', () => {
        if (document.querySelector('.modal-dialog')) {
            return;
        }
    
        const bin_index = bins.indexOf(bin);
        const modal_overlay = document.createElement('div');
        const modal_window = document.createElement('div');
        
        modal_overlay.classList.add('modal-overlay');
        modal_overlay.style.position = 'fixed';
        modal_overlay.style.top = '0';
        modal_overlay.style.left = '0';
        modal_overlay.style.width = '100%';
        modal_overlay.style.height = '100%';
        modal_overlay.style.background = 'rgba(0, 0, 0, 0.4)';
        modal_overlay.style.zIndex = '1040';
    
        modal_window.classList.add('modal-dialog', 'modal-dialog-centered');
        modal_window.style.position = 'fixed';
        modal_window.style.top = '50%';
        modal_window.style.left = '50%';
        modal_window.style.transform = 'translate(-50%, -50%)';
        modal_window.style.zIndex = '1050';
        modal_window.style.borderRadius = '3%';
        modal_window.innerHTML = `
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
        `;
    
        modal_overlay.appendChild(modal_window);
        document.body.appendChild(modal_overlay);
        document.body.style.overflow = 'hidden';
    
        const cancel_button = modal_window.querySelector('.btn-secondary');
        const submit_button = modal_window.querySelector('.btn-danger');
    
        const closeModal = () => {
            modal_overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('click', outsideClickListener);
        };
    
        cancel_button.addEventListener('click', closeModal);
    
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
                    closeModal();
                } else {
                    console.error('Error deleting activity:', data.error);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
            });
        });
    
        const outsideClickListener = (e) => {
            if (!modal_window.contains(e.target) && !bin.contains(e.target)) {
                closeModal();
            }
        };
    
        document.addEventListener('click', outsideClickListener);
    });
    
    
}

function add_buttons(activity_data, subject, subinfo) {
    for (let i = 0; i < activity_data.length; i++) {
        const activity = document.createElement('div');
        const activity_label = document.createElement('div');
        const bin = document.createElement('img');
        add_tile(
            activity,
            activity_label,
            subject[i],
            bin, 
            activity_data[i].id,
            subinfo[i],
            activity_data[i].info,
            activity_data[i].image
            );
        bins.push(bin);
        tiles.push(activity);
    }
}

add_activity_btn.addEventListener('click', () => {
    if (document.querySelector('.modal-dialog')) {
        return;
    }

    const modal_overlay = document.createElement('div');
    const modal_window = document.createElement('div');

    modal_overlay.classList.add('modal-overlay');
    modal_overlay.style.position = 'fixed';
    modal_overlay.style.top = '0';
    modal_overlay.style.left = '0';
    modal_overlay.style.width = '100%';
    modal_overlay.style.height = '100%';
    modal_overlay.style.background = 'rgba(0, 0, 0, 0.4)';
    modal_overlay.style.zIndex = '1040';

    modal_window.classList.add('modal-dialog', 'modal-dialog-centered');
    modal_window.style.position = 'fixed';
    modal_window.style.top = '50%';
    modal_window.style.left = '50%';
    modal_window.style.transform = 'translate(-50%, -50%)';
    modal_window.style.zIndex = '1050';
    modal_window.style.borderRadius = '3%';
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

    const input_group = modal_window.querySelector('.input-group');
    const subject_wrapper = document.createElement('div');

    subject_wrapper.classList.add('activity-input-wrapper');
    input_group.appendChild(subject_wrapper);

    subject_wrapper.innerHTML = `
        <div class="input-group-prepend">
            <span class="input-group-text">Предмет</span>
        </div>
        <select class="form-select activity-select" aria-label="Default select example">
            <option selected value="">Выберите предмет</option>
            <option value="Математика">Математика</option>
            <option value="Физика">Физика</option>
            <option value="Русский язык">Русский язык</option>
            <option value="Химия">Химия</option>
            <option value="Литература">Литература</option>
            <option value="Английский язык">Английский язык</option>
            <option value="Немецкий язык">Немецкий язык</option>
            <option value="История">История</option>
            <option value="География">География</option>
            <option value="Биология">Биология</option>
            <option value="Обществознание">Обществознание</option>
            <option value="Технология">Технология</option>
            <option value="ИЗО">ИЗО</option>
            <option value="another-choice">Свой вариант</option>
        </select>
    `;
    const subinfo_wrapper1 = document.createElement('div');
    const paragraph_subinfo_wrapper = document.createElement('div');
    const own_input = document.createElement('div')

    input_group.appendChild(own_input);
    own_input.innerHTML = `
            <input type="text" class="form-control activity-name"></input>
    `
    subinfo_wrapper1.classList.add('activity-input-wrapper');
    input_group.appendChild(paragraph_subinfo_wrapper);
    input_group.appendChild(subinfo_wrapper1);


    switch (activity_type) {
        case 'olympiads':
            subinfo_wrapper1.innerHTML = `
                <div class="input-group-prepend">
                    <span class="input-group-text">Место</span>
                </div>
                <input type="text" class="form-control activity-place">
            `;
            break;
    
        case 'tutors':
            const subinfo_wrapper2 = document.createElement('div');
            const subinfo_wrapper3 = document.createElement('div');

            subinfo_wrapper2.classList.add('activity-input-wrapper');
            subinfo_wrapper3.classList.add('activity-input-wrapper');

            input_group.appendChild(subinfo_wrapper2);
            input_group.appendChild(subinfo_wrapper3);
        
            paragraph_subinfo_wrapper.innerHTML = `
                <p>Данные о репетиторе</p>
            `;

            subinfo_wrapper1.innerHTML = `
            <div class="input-group-prepend">
                <span class="input-group-text">Фамилия</span>
            </div>
            <input type="text" class="form-control activity-tutor-surname">
            `;

            subinfo_wrapper2.innerHTML = `
                <div class="input-group-prepend">
                    <span class="input-group-text">Имя</span>
                </div>
                <input type="text" class="form-control activity-tutor-name">
            `;

            subinfo_wrapper3.innerHTML = `
                <div class="input-group-prepend">
                    <span class="input-group-text">Отчество</span>
                </div>
                <input type="text" class="form-control activity-tutor-patronymic">
            `;

            break;
    }

    const info_wrapper = document.createElement('div');

    info_wrapper.classList.add('activity-input-wrapper');
    input_group.appendChild(info_wrapper);

    info_wrapper.innerHTML = `
        <div class="input-group-prepend">
            <span class="input-group-text">Информация</span>
        </div>
        <input type="text" class="form-control activity-info">
    `;

    document.body.appendChild(modal_window);
    document.body.appendChild(modal_overlay);

    document.body.style.overflow = 'hidden';

    const cancel_button = modal_window.querySelector('.btn-secondary');
    const submit_button = modal_window.querySelector('.add-activity-descr');

    const closeModal = () => {
        modal_window.remove();
        modal_overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('click', outsideClickListener);
    };

    let isInput = false;
    document.querySelector('.activity-select').addEventListener("change", function(){
        const customInput = document.querySelector('.activity-name');
        if (this.value === 'another-choice') {
            customInput.style.display = 'flex';
            isInput = true;
        } else {
            customInput.style.display = 'none';
            isInput = false;
        }
    })

    cancel_button.addEventListener('click', closeModal);

    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        
        let selected_name = '';
            
        isInput ? selected_name = '.activity-name' : selected_name = '.form-select';

        const activity_name = modal_window.querySelector(selected_name);
        const activity_subinfo = modal_window.querySelector('.activity-place');
        const activity_info = modal_window.querySelector('.activity-info');
        const error_label = modal_window.querySelector('.error-message');
        let subinfo;
        
        switch (activity_type) {
            case 'olympiads':
                subinfo = activity_subinfo.value;
                break;
        
            case 'tutors':
                const tutor_name = modal_window.querySelector('.activity-tutor-name');
                const tutor_surname = modal_window.querySelector('.activity-tutor-surname');
                const tutor_patronymic = modal_window.querySelector('.activity-tutor-patronymic');

                if (tutor_name.value == "" || tutor_surname.value == "") {
                    error_label.style = "display: flex";
                    error_label.textContent = "Пожалуйста, введите фамилию и имя репетитора";
                }
                subinfo = {
                    'name': tutor_name.value,
                    'surname': tutor_surname.value,
                    'patronymic': tutor_patronymic.value
                }
                break;
        }

        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                added_activity: {
                    name: activity_name.value,
                    subinfo: subinfo,
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
                let subinfo_str = "";
                bins.push(bin);
                tiles.push(activity);
                activity_labels.push(activity_name.value);

                switch (activity_type) {
                    case 'olympiads':
                        subinfo != "" ? subinfo_str = `Место: ${subinfo}` : subinfo_str = ``;
                        
                        break;
                
                    case 'tutors':
                        subinfo_str = `Репетиторы: ${subinfo['surname']} ${subinfo['name']} ${subinfo['patronymic']}`;
                        break;
                }
                async function fetchData() {
                    try {
                        const response = await fetch('');
                        if (!response.ok) {
                            throw new Error(`status: ${response.status}`);
                        }
                        const data = await response.json();
                        return data.data.pop()
                    } catch (error) {
                        console.error(error);
                    }
                }
                fetchData().then(new_activity => {
                    add_tile(
                        activity,
                        activity_label,
                        activity_name.value,
                        bin,
                        data.ID,
                        subinfo_str,
                        activity_info.value,
                        new_activity.image
                    );
                });
                
                label.style = "display: none";
                error_label.style = "display: none";
                closeModal();
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
            closeModal()
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

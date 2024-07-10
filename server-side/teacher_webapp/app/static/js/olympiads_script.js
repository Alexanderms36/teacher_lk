const olympiads_wrapper = document.querySelector('.olympiads-wrapper');
const bins = [];
const tiles = [];
const olympiad_labels = [];
const add_olympiads_btn = document.querySelector('.add-button');
const label = document.querySelector('.olympiads-wrapper h1');


if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

fetch('')
  .then(response => response.json())
  .then(data => {
    const activity_data = data.data;
    if (activity_data.length != 0) {
        console.log(activity_data)
        add_buttons(activity_data);
    } else {
        label.textContent = "У выбранного ученика пока нет олимпиад";
    }
  })
  .catch(error => {
    console.error(error);
  });

function add_tile(olympiad, olympiad_label, text_label, bin, olympiad_id, bin_wrapper, subinfo, info, pic) {
    const img_wrap = document.createElement('img');
    const activity_wrapper = document.createElement('div');
    const allinfolabel = document.createElement('div');
    const olympiad_name_span = document.createElement('span');
    const place_wrapper = document.createElement('div');
    const activity_subinfo_span = document.createElement('span');
    const info_wrapper = document.createElement('div');
    const info_span = document.createElement('span')

    olympiads_wrapper.appendChild(olympiad);
    olympiad.classList.add('olympiad-tile');
    olympiad.appendChild(olympiad_label);
    olympiad.appendChild(bin_wrapper)
    bin_wrapper.classList.add('bin-wrapper')
    olympiad_label.classList.add('tile-label');

    if (localStorage.getItem('theme') !== null) {
        bin.src = "http://127.0.0.1:8000/static/images/recycle_bin_white.png";
    } else {
        bin.src = "http://127.0.0.1:8000/static/images/recycle_bin.png";
    }

    bin_wrapper.appendChild(bin);
    olympiad.appendChild(activity_wrapper);
    activity_wrapper.appendChild(img_wrap);
    activity_wrapper.classList.add('activity-pic');
    olympiad.appendChild(allinfolabel);
    allinfolabel.appendChild(olympiad_label);
    olympiad_label.appendChild(olympiad_name_span);
    allinfolabel.appendChild(place_wrapper);
    place_wrapper.classList.add('place-label');
    place_wrapper.appendChild(activity_subinfo_span);
    olympiad.appendChild(info_wrapper);
    info_wrapper.classList.add('info-wrapper');
    info_wrapper.appendChild(info_span);

    img_wrap.src = pic;
    olympiad_name_span.textContent = text_label;
    activity_subinfo_span.textContent = subinfo;
    info_span.textContent = info
    
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
                        <h5 class="modal-title" style="margin: 1vw;">Удалить олимпиаду?</h5>
                    </div>
                    <div class="modal-body" style="padding: 1vw;margin-bottom: 1vw;">
                        Вы уверены, что хотите удалить олимпиаду: "${text_label}"?
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
                    deleted_olympiad_id: olympiad_id
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bins.splice(bin_index, 1);
                    tiles.splice(bin_index, 1);
                    olympiad_labels.splice(bin_index, 1);
                    olympiad.remove();
                    if (tiles.length == 0) {
                        label.style = "display: inline-flex";
                        label.textContent = "У выбранного ученика пока нет олимпиад";
                    }
                    modal_window.remove();
                } else {
                    console.error('Error deleting olympiad:', data.error);
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

function add_buttons(olympiad_data) {
    for (let i = 0; i < olympiad_data.length; i++) {
        const olympiad = document.createElement('div');
        const olympiad_label = document.createElement('div');
        const bin = document.createElement('img');
        const bin_wrapper = document.createElement('div');
        add_tile(
            olympiad,
            olympiad_label, 
            olympiad_data[i].name, 
            bin, 
            olympiad_data[i].id, 
            bin_wrapper, 
            olympiad_data[i].place,
            olympiad_data[i].info,
            "http://127.0.0.1:8000/static/images/activity_backgrounds/3.jpg"
            );
        bins.push(bin);
        tiles.push(olympiad);
    }
}

add_olympiads_btn.addEventListener('click', () => {
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
                    <h5 class="modal-title" style="margin: 1vw;">Добавьте олимпиаду</h5>
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
                            <input name="newOlympiad" type="text" class="form-control olympiad-name">
                        </div>
                        <div style="display: inline-flex;width:100%; margin-bottom:1vw;">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Место</span>
                            </div>
                            <input name="newOlympiad" type="text" class="form-control olympiad-place">
                        </div>
                        <div style="display: inline-flex; width:100%; margin-bottom:1vw;">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Информация</span>
                            </div>
                            <input name="newOlympiad" type="text" class="form-control olympiad-info">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;margin-top: 1vw;">Отмена</button>
                    <form method="post">
                        <button type="submit" class="btn add-olympiad-descr" style="margin-bottom: 1vw;margin-left: 1vw;margin-right: 1vw;margin-top: 1vw;">Добавить</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal_window);
    const cancel_button = modal_window.querySelector('.btn-secondary');
    const submit_button = modal_window.querySelector('.add-olympiad-descr');

    cancel_button.addEventListener('click', () => {
        modal_window.remove();
    });

    submit_button.addEventListener('click', (e) => {
        e.preventDefault();
        const olympiad_name = modal_window.querySelector('.olympiad-name');
        const olympiad_place = modal_window.querySelector('.olympiad-place');
        const olympiad_info = modal_window.querySelector('.olympiad-info');
        const error_label = modal_window.querySelector('.error-message');
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                added_olympiad: {
                    name: olympiad_name.value,
                    place: olympiad_place.value,
                    info: olympiad_info.value
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const olympiad = document.createElement('div');
                const olympiad_label = document.createElement('div');
                const bin = document.createElement('img');
                const bin_wrapper = document.createElement('div');
                bins.push(bin);
                tiles.push(olympiad);
                olympiad_labels.push(olympiad_name.value);
                add_tile(
                    olympiad,
                    olympiad_label,
                    olympiad_name.value,
                    bin,
                    data.ID,
                    bin_wrapper,
                    olympiad_place.value,
                    olympiad_info.value,
                    "http://127.0.0.1:8000/static/images/activity_backgrounds/2.jpg"
                );
                label.style = "display: none";
                error_label.style = "display: none";
                modal_window.remove();
            } else {
                switch (data.message?.schema_text[0]) {
                    case "Invalid value.":
                        error_label.style = "display: flex";
                        error_label.textContent = "Пожалуйста, введите корректное название олимпиады";
                        break;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    document.addEventListener('click', (e) => {
        if (!modal_window.contains(e.target) && !add_olympiads_btn.contains(e.target)) {
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

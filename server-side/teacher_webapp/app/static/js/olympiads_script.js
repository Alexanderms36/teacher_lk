const olympiads_wrapper = document.querySelector('.olympiads-wrapper');
const bins = [];
const tiles = [];
const olympiad_labels = ['Русский язык', 'Математика'];
const add_olympiads_btn = document.querySelector('.add-button');


if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

fetch('')
  .then(response => response.json())
  .then(data => {
    const olympiad_data = data.data;
    console.log(olympiad_data);
    add_buttons(olympiad_data);
  })
  .catch(error => {
    console.error(error);
  });

function add_tile(olympiad, olympiad_label, text_label, bin, olympiad_id) {
    olympiads_wrapper.appendChild(olympiad);
    olympiad.classList.add('olympiad-tile');
    olympiad.appendChild(olympiad_label);
    olympiad_label.textContent = text_label;
    olympiad_label.classList.add('tile-label');
    bin.src = "http://127.0.0.1:8000/static/images/recycle_bin.png";
    olympiad.appendChild(bin);
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
        add_tile(olympiad, olympiad_label, olympiad_data[i].name, bin, olympiad_data[i].id)
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
        <div class="modal-dialog modal-dialog-centered" style="border-radius: 10px;">
            <div class="modal-content" data-backdrop="static" style="box-sizing: border-box;">
                <div class="modal-header">
                    <h5 class="modal-title" style="margin: 1vw;">Добавьте олимпиаду</h5>
                </div>
                <div class="modal-body" style="margin: 1.3vw;">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Название</span>
                        </div>
                        <input name="newOlympiad" type="text" class="form-control olympiad-name">
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
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                added_olympiad_name: olympiad_name.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const olympiad = document.createElement('div');
                const olympiad_label = document.createElement('div');
                const bin = document.createElement('img');
                bins.push(bin);
                tiles.push(olympiad);
                olympiad_labels.push(olympiad_name.value);
                add_tile(olympiad, olympiad_label, olympiad_name.value, bin, data.ID);
                modal_window.remove();
            } else {
                console.error('Error adding olympiad:', data.error);
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

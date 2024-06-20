const olympiads_wrapper = document.querySelectorAll('.olympiads-wrapper')[0];

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
bins = [];
//список подтянем с сервера
const olympiad_labels = ['Русский язык', 'Математика', 'История', 'Физика']

for (let i = 0; i < olympiad_labels.length; i++) {
    const olympiad = document.createElement('div');
    olympiads_wrapper.appendChild(olympiad);
    olympiad.classList.add('olympiad-tile');

    const olympiad_label = document.createElement('div');
    olympiad.appendChild(olympiad_label);
    olympiad_label.textContent = olympiad_labels[i];
    olympiad_label.classList.add('tile-label');
    const bin = document.createElement('img');
    bin.src = './templates/src/recycle_bin.png';
    olympiad.appendChild(bin);
    bin.classList.add('bin');
    bins.push(bin);
}
const tiles = document.querySelectorAll('.olympiad-tile')

bins.forEach((bin, i) => {
    bin.addEventListener('click', () => {
        const modal_window = document.createElement('div');
        modal_window.classList.add('modal-dialog', 'modal-dialog-centered');
        modal_window.style.zIndex = '1050';
        modal_window.style.position = 'absolute';
        modal_window.style.top = '0px';
        modal_window.style.left = '0px';
        modal_window.style.width = '100%';
        modal_window.style.height = '100%';
        modal_window.style.background = 'rgba(0, 0, 0, 0.5)';
        modal_window.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" style="border-radius: 10px;">
                <div class="modal-content" data-backdrop="static">
                    <div class="modal-header">
                        <h5 class="modal-title" style="margin: 1vw;">Удалить олимпиаду?</h5>
                    </div>
                    <div class="modal-body" style="padding: 1vw;">
                        Вы уверены, что хотите удалить олимпиаду: "${olympiad_labels[i]}"?
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
        submit_button.addEventListener('click', () => {
            tiles[i].remove();
            modal_window.remove();
        })
        //отправить на сервер, что удалили
    })
})


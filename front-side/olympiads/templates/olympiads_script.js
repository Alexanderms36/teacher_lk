const olympiads_wrapper = document.querySelectorAll('.olimpiads-wrapper')[0];


if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

//список подтянем с сервера
const olympiad_labels = ['Русский язык']

for (let i = 0; i < 1; i++) {
    const olympiad = document.createElement('div');
    olympiad.textContent = olympiad_labels[i];
    olympiads_wrapper.appendChild(olympiad);
    main_button.classList.add('main-button');
}
const student_image = document.getElementById('student-image');
const health_group = document.querySelectorAll('.profile-wrapper a')[0];
//всё это из бд с учениками подтянем
health_group.innerHTML = "(Группа здоровья)";
const activities_wrapper = document.querySelectorAll('.activities-wrapper')[0];
const button_labels = ["КРУЖКИ", "РЕПЕТИТОРЫ", "ОЛИМПИАДЫ", "ЛИЧНЫЙ КАБИНЕТ УЧЕНИКА"];


for (let i = 0; i < button_labels.length; i++) {
    const main_button = document.createElement('button');
    main_button.textContent = button_labels[i];
    activities_wrapper.appendChild(main_button);
    main_button.classList.add('main-button');
}

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

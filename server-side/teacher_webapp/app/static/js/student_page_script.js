const student_image = document.getElementById('student-image');
const student_name = document.querySelectorAll('.profile-wrapper a')[0];
const health_group = document.querySelectorAll('.profile-wrapper a')[1];
const activities_wrapper = document.querySelectorAll('.activities-wrapper')[0];
const button_labels = ["КРУЖКИ", "РЕПЕТИТОРЫ", 
                        "ОЛИМПИАДЫ", "ЛИЧНЫЙ КАБИНЕТ УЧЕНИКА"];
const button_names = ["afterschool_activity", "tutors", "olympiads", "student_lk"]

fetch('')
  .then(response => response.json())
  .then(data => {
    const student_data = data.data;
    student_name.innerHTML = `${student_data.surname} ${student_data.name} ${student_data.patronymic}`;
    health_group.innerHTML = student_data.health_group;
    health_group.style = 'color: rgb(33, 37, 42);';
  })
  .catch(error => {
    console.error(error);
  });

for (let i = 0; i < button_labels.length; i++) {
    const main_button = document.createElement('button');
    main_button.textContent = button_labels[i];
    activities_wrapper.appendChild(main_button);
    main_button.classList.add('main-button');
    main_button.name = 'chosen_activity';
    main_button.value = button_names[i];
}

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

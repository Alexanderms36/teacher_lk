const class_label = document.getElementById('class-label')

//здесь подтянем выбранный класс из бд
let chosen_class = 9;

class_label.innerHTML = `Учащиеся ${chosen_class} класса`;
const wrapper_for_students = document.getElementsByClassName('students-list-wrapper')[0];
// этих студентов тоже подтянем из бд
const students = [
    "Иванов Иван Иванович Ваня Ванов Ванович",
    "Иванова Екатерина",
    "Петров Александр",
    "Сидоров Михаил",
    "Изергин Дмитрий Борисович",
    "Тауматафакатангихангакоауауотаматеатурипукакапикимаунгахоронукупокаифенуакитанатаху",
    "абоба",
];

for (let i = 1; i <= students.length; i++) {
    const new_wrapper_for_button = document.createElement('div');
    const new_circle_with_num = document.createElement('div');
    const student_button = document.createElement('input');
    student_button.type = 'button';

    new_wrapper_for_button.classList.add("student-button-wrapper");
    new_circle_with_num.classList.add('circle');
    student_button.classList.add('student-button');

    new_wrapper_for_button.appendChild(new_circle_with_num);
    wrapper_for_students.appendChild(new_wrapper_for_button);
    new_wrapper_for_button.appendChild(student_button);


    new_circle_with_num.innerHTML = i;
    student_button.value = students[i - 1];
}


if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

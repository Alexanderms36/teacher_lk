const class_label = document.getElementById('class-label')
const wrapper_for_students = document.getElementsByClassName('students-list-wrapper')[0];
const label = document.querySelector('.students-list-wrapper h1');


fetch('')
  .then(response => response.json())
  .then(data => {
    const user_data = data.data[0];
    class_label.innerHTML = `Учащиеся ${user_data.name} класса`;
    addStudentsButtons(user_data.students);
  })
  .catch(error => {
    console.error(error);
  });

function addStudentsButtons(students) {
  if (students.length != 0) {
    for (let i = 0; i < students.length; i++) {
        const new_wrapper_for_button = document.createElement('div');
        const new_circle_with_num = document.createElement('div');
        const student_button = document.createElement('button');
        
        new_wrapper_for_button.classList.add("student-button-wrapper");
        new_circle_with_num.classList.add('circle');
        student_button.classList.add('student-button');
            
        new_wrapper_for_button.appendChild(new_circle_with_num);
        wrapper_for_students.appendChild(new_wrapper_for_button);
        new_wrapper_for_button.appendChild(student_button);
    
        new_circle_with_num.innerHTML = i + 1;
        student_button.textContent = `${students[i].surname} ${students[i].name} ${students[i].patronymic}`;
        student_button.name = `chosen_student`;
        student_button.value = students[i].id;
    }
  } else {
    label.style = "display: block"
    label.textContent = "В данный класс ученики ещё не добавлены.";
  }
}

if (localStorage.getItem('theme') !== null) {
    document.documentElement.setAttribute('data-theme', 'dark');
}
